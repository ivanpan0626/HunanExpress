import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import stripeRouter from "./routers/stripe.router.js";

import { dbconnect } from "./config/database.config.js";
import bodyParser from "body-parser";

dbconnect();

const app = express();
app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

// API Routes
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/stripe", stripeRouter);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
