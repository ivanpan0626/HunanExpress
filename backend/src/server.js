import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';

import { dbconnect } from './config/database.config.js';
import stripe from 'stripe';

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
// Connect to the database
dbconnect();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));

// API Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);

// Stripe Checkout: Create a Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items} = req.body; // Get items and taxes/fees from the frontend request

        // Calculate the total amount dynamically (e.g., based on items in the cart)
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

      // Create a Checkout Session
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            ...items.map(item => ({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: item.name,
                  description: item.description,
                },
                unit_amount: item.price * 100, // Stripe expects the amount in cents
              },
              quantity: item.quantity,
              tax_rates: ['txr_1QOVqnGMMMgbOUn4hWrg15lb'],
            })),
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Support Local Fee',
                },
                unit_amount: 99,
              },
              quantity: 1,
            },
          ],
        mode: 'payment',
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['US', 'CA'],
        },
        success_url: `http://localhost:3000/checkout`,
        cancel_url: `http://localhost:3000/`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
