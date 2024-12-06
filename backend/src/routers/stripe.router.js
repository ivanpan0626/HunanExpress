import { Router } from "express";
import handler from "express-async-handler";
import stripe from "stripe";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OrderModel } from "../models/order.model.js";
import { TokenModel } from "../models/token.model.js";
import {
  deliveryEmailTemplate,
  pickupEmailTemplate,
} from "../constants/orderEmail.template.js";

import dotenv from "dotenv";
dotenv.config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, // Replace with your client ID
  process.env.GOOGLE_SECRET, // Replace with your client secret
  process.env.GOOGLE_REDIRECT_URI // The redirect URI you set in Google Cloud
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// A function to check if the access token is expired and refresh it if needed
const getAccessToken = async () => {
  let credentials = await TokenModel.findOne({ service: "google" });

  // Check if the access token is expired (expires_in is usually in seconds)
  if (!credentials.expiryDate || credentials.expiryDate <= Date.now()) {
    console.log(
      `Access token expired ${new Date(credentials.expiryDate).toLocaleString(
        "en-US",
        {
          timeZone: "America/New_York",
        }
      )}, refreshing...`
    );
    // Refresh the access token
    const response = await oauth2Client.refreshAccessToken();
    const { access_token, expiry_date } = response.credentials;

    credentials = await TokenModel.findOneAndUpdate(
      { service: "google" },
      {
        accessToken: access_token,
        expiryDate: new Date(expiry_date),
      },
      { upsert: true, new: true }
    );

    console.log(
      `Access Token Refreshed ${new Date(
        response.credentials.expiry_date
      ).toLocaleString("en-US", {
        timeZone: "America/New_York",
      })}`
    );
  }

  return credentials.access_token;
};

// Create an async function to create a transporter that always uses a valid access token
const createTransporter = async () => {
  const accessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SENDER, // Your Gmail address
      clientId: process.env.GOOGLE_CLIENT_ID, // Your client ID
      clientSecret: process.env.GOOGLE_SECRET, // Your client secret
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Your refresh token
      accessToken: accessToken, // Dynamically retrieved access token
    },
  });
};

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Checkout session handler (GET route)
router.get(
  "/checkout-session/:id",
  handler(async (req, res) => {
    try {
      const sessionId = req.params.id; //obtains sessionId

      let order = await OrderModel.findOne({ sessionId });
      if (order && order.isProcessed) {
        return res.status(200).json({
          title: "Thank you for ordering with us!",
          body: "Order is already processed!",
          footer: "Contact us at 201-384-1880 for any issues!",
        });
      }

      // Retrieve the session from Stripe API
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      const lineItems = await stripeClient.checkout.sessions.listLineItems(
        sessionId
      );

      const customData = JSON.parse(session.metadata.custom_data);

      const orderSummary = {
        customerPaid: session.payment_status,
        customerName: customData.name,
        customerPhone: customData.phone,
        shippingAddress: customData.address || null,
        shippingApt: customData.apt || null,
        shippingCity: customData.city || null,
        shippingZipCode: customData.zipcode || null,
        deliveryTime:
          customData.deliveryTime === "" ? "ASAP" : customData.deliveryTime,
        pickupTime:
          customData.pickupTime === "" ? "ASAP" : customData.pickupTime,
        subTotal: session.amount_subtotal / 100, // Subtotal in dollars
        feesTaxes:
          session.total_details.amount_tax / 100 +
          session.shipping_cost.amount_total / 100, // Taxes in dollars
        totalAmount: session.amount_total / 100, // Total amount in dollars (including tax and fees)
      };

      const orderDetails = await Promise.all(
        lineItems.data.map(async (item) => {
          // Retrieve the product using the price's product ID
          const product = await stripeClient.products.retrieve(
            item.price.product
          );

          return {
            name: product.name,
            description:
              product.description === "empty" ? "" : product.description, // Access the description from the product
            qty: item.quantity,
            price: item.amount_subtotal / 100, // Price per item in dollars
          };
        })
      );

      if (!order) {
        order = new OrderModel({
          sessionId,
          customerData: orderSummary || null,
          items: orderDetails || null,
        });
        await order.save();
      }

      // Create transporter and send email
      const transporter = await createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_SENDER, // Your email address
        to: process.env.EMAIL_RECIEVER, // The email address where you want to receive the order details
        subject: `${
          customData.orderType === "pickup" ? "Pickup" : "Delivery"
        } Order Received! Order#${order.orderNumber} [${
          orderSummary.customerPaid
        }]`,
        html:
          customData.orderType === "pickup"
            ? pickupEmailTemplate(orderSummary, orderDetails)
            : deliveryEmailTemplate(orderSummary, orderDetails),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent!");
      } catch {
        console.log("error with email sending transporter");
      }

      order.isProcessed = true;
      await order.save();

      if (customData.order == "pickup") {
        res.status(200).json({
          title: "Thank you for ordering with us!",
          body: "Please Pickup at 161 N Washington Ave, Bergenfield, NJ, 07621",
          footer: "Contact us at 201-384-1880 for any issues!",
        });
      } else {
        res.status(200).json({
          title: "Thank you for ordering with us!",
          body: "We will try our best to deliver your order on time!",
          footer: "Contact us at 201-384-1880 for any issues!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        title: "System Error",
        body: "Please try again!",
        footer:
          "You can also order at 201-384-1880, if website is malfunctioning!",
      });
    }
  })
);

// Stripe Checkout: Create a Checkout Session
router.post(
  "/create-checkout-session",
  handler(async (req, res) => {
    try {
      const { items, customData } = req.body;

      // Create a Checkout Session
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          ...items.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                description: item.description,
              },
              unit_amount: item.price * 100, // Stripe expects the amount in cents
            },
            quantity: item.quantity,
            tax_rates: ["txr_1QOVqnGMMMgbOUn4hWrg15lb"],
          })),
        ],
        shipping_options: [
          {
            shipping_rate: "shr_1QOoqyGMMMgbOUn4ickW9f1a",
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5000/checkout`,
        metadata: {
          custom_data: JSON.stringify(customData), // Store custom data here
        },
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  })
);

export default router;
