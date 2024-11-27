import { model, Schema } from "mongoose";
import { CounterModel } from "./counter.model.js";

export const OrderSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    orderNumber: { type: Number, unique: true, required: false }, // Sequential order number
    isProcessed: { type: Boolean, default: false },
    customerData: { type: Object, required: true },
    items: [
      {
        name: { type: String, required: true }, // Item name
        qty: { type: Number, required: true }, // Quantity
        price: { type: Number, required: true }, // Price per item in dollars
      },
    ],
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Fetch and update the order counter
      const counter = await CounterModel.findOneAndUpdate(
        { name: "orders" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true } // upsert ensures the counter is created if not found
      );

      if (!counter) {
        throw new Error("Failed to initialize or update the counter.");
      }

      console.log("Counter found/updated:", counter);

      // Set the order number to the updated sequence value
      this.orderNumber = counter.sequenceValue;

      console.log("Order number set:", this.orderNumber);

      next();
    } catch (error) {
      console.error("Error updating the counter: ", error);
      next(error); // Propagate the error if any
    }
  } else {
    next();
  }
});

export const OrderModel = model("order", OrderSchema);
