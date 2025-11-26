import mongoose, { Schema, Document, Model } from "mongoose";

// Interface với responses
export interface ISupportTicket extends Document {
  ticketId: string;
  clientId: string;
  message: string;
  created_at: Date;
  responses?: {
    message: string;
    admin: boolean;
    created_at: Date;
  }[];
}

// Schema với responses
const SupportTicketSchema = new Schema<ISupportTicket>({
  ticketId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  responses: [
    {
      message: { type: String, required: true },
      admin: { type: Boolean, required: true },
      created_at: { type: Date, default: Date.now },
    },
  ],
});

export const SupportTicketModel: Model<ISupportTicket> =
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
