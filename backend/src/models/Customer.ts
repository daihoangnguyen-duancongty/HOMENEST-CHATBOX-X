// models/Customer.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  customerId: string;
  clientId: string;
  name: string;
  avatar?: string;
  chatMode?: "bot" | "human";
  createdAt: Date;
}

const CustomerSchema = new Schema(
  {
    customerId: { type: String, unique: true, required: true },
    clientId: { type: String, required: true, index: true },
    name: { type: String, default: "Khách hàng" },
    avatar: String,
    chatMode: { type: String, enum: ["bot", "human"], default: "bot" },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<ICustomer>("Customer", CustomerSchema);
