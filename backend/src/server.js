import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import stripeRouter from "./routers/stripe.router.js";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url"; // Add this import

import { dbconnect } from "./config/database.config.js";
import bodyParser from "body-parser";

dbconnect();

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve static files from the React app
app.use(express.static("./build"));

// Catch-all for routes not handled by Express (send the React app's entry point)
app.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
