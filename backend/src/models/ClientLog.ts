import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClientLog extends Document {
  clientId: string;
  action: string;
  description?: string;
  created_at: Date;
}

const ClientLogSchema: Schema<IClientLog> = new Schema({
  clientId: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const ClientLogModel: Model<IClientLog> = mongoose.model<IClientLog>("ClientLog", ClientLogSchema);
