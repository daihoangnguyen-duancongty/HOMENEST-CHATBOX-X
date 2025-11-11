import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp?: Date;
}

export interface IChat extends Document {
  clientId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    clientId: { type: String, required: true, index: true },
    messages: [
      {
        from: { type: String, enum: ['user', 'bot'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);
