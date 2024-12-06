import { model, Schema } from "mongoose";

export const TokenSchema = new Schema({
  service: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

export const TokenModel = model("token", TokenSchema);
