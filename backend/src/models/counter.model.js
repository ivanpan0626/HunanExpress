import { model, Schema } from "mongoose";

const CounterSchema = new Schema({
  name: { type: String, required: true, unique: true }, // Identifier for the counter
  sequenceValue: { type: Number, default: 0 }, // Current sequence value
});

export const CounterModel = model("counter", CounterSchema);
