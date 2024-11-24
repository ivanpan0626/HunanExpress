import { Router } from "express";
import handler from "express-async-handler";
import stripe from "stripe";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import { google } from "googleapis";

import dotenv from "dotenv";
dotenv.config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, // Replace with your client ID
  process.env.GOOGLE_SECRET, // Replace with your client secret
  process.env.GOOGLE_REDIRECT_URI // The redirect URI you set in Google Cloud
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // Replace with your refresh token
});

// Set up Nodemailer for email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_SENDER, // Your Gmail address
    clientId: process.env.GOOGLE_CLIENT_ID, // Your client ID
    clientSecret: process.env.GOOGLE_SECRET, // Your client secret
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Your refresh token
    accessToken: oauth2Client.getAccessToken(), // Access token
  },
});

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
// Connect to the database

router.get(
  "/checkout-session/:id",
  handler(async (req, res) => {
    try {
      const sessionId = req.params.id;

      // Retrieve the session from Stripe API
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      const lineItems = await stripeClient.checkout.sessions.listLineItems(
        sessionId
      );

      const customData = JSON.parse(session.metadata.custom_data);

      const orderSummary = {
        customerPaid: session.payment_status,
        customerName: customData.name,
        customerEmail: customData.phone,
        shippingAddress: customData.address,
        subTotal: session.amount_subtotal / 100, // Subtotal in dollars
        feesTaxes:
          session.total_details.amount_tax / 100 +
          session.shipping_cost.amount_total / 100, // Taxes in dollars
        totalAmount: session.amount_total / 100, // Total amount in dollars (including tax and fees)
      };

      const orderDetails = lineItems.data.map((item) => ({
        name: item.description, // or item.price_data.product_data.name
        qty: item.quantity,
        price: item.amount_subtotal / 100, // Price per item in dollars
      }));

      // Email template
      const mailOptions = {
        from: process.env.EMAIL_SENDER, // Your email address
        to: process.env.EMAIL_RECIEVER, // The email address where you want to receive the order details
        subject: `New Order Received! [${orderSummary.customerPaid}]`,
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #f4f4f4;
                  padding: 20px;
                  border-radius: 8px;
                }
                h2 {
                  color: #444;
                }
                .order-summary, .order-details {
                  margin-bottom: 20px;
                  padding: 10px;
                  background: #fff;
                  border-radius: 6px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .order-summary h3, .order-details h3 {
                  margin: 0;
                  font-size: 18px;
                  color: #555;
                }
                .order-summary p, .order-details p {
                  margin: 10px 0;
                }
                .order-details table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 10px 0;
                }
                .order-details table, th, td {
                  border: 1px solid #ddd;
                }
                th, td {
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f4f4f4;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>New Order Received</h2>
                
                <div class="order-summary">
                  <h3>Order Summary</h3>
                  <p><strong>Status:</strong> ${orderSummary.customerPaid}</p>
                  <p><strong>Name:</strong> ${orderSummary.customerName}</p>
                  <p><strong>Email:</strong> ${orderSummary.customerEmail}</p>
                  <p><strong>Shipping Address:</strong> ${
                    orderSummary.shippingAddress
                  }</p>
                  <p><strong>Subtotal:</strong> $${orderSummary.subTotal.toFixed(
                    2
                  )}</p>
                  <p><strong>Taxes:</strong> $${orderSummary.feesTaxes.toFixed(
                    2
                  )}</p>
                  <p><strong>Total Amount Paid:</strong> $${orderSummary.totalAmount.toFixed(
                    2
                  )}</p>
                </div>
      
                <div class="order-details">
                  <h3>Order Details</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderDetails
                        .map(
                          (item) => `
                        <tr>
                          <td>${item.name}</td>
                          <td>${item.qty}</td>
                          <td>$${item.price.toFixed(2)}</td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
      
                <div class="footer">
                  <p>Thank you for using our service!</p>
                  <p>If you have any questions or issues, feel free to reach out.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).send({ error: "Failed to retrieve session" });
    }
  })
);

// Stripe Checkout: Create a Checkout Session
router.post(
  "/create-checkout-session",
  handler(async (req, res) => {
    try {
      const { items, customData } = req.body;

      // Calculate the total amount dynamically (e.g., based on items in the cart)
      const totalAmount = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

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
        success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/checkout`,
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
