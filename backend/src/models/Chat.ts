import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp?: Date;
}

export interface IChat extends Document {
  clientId: string;
  userId: string;       // ID người dùng đăng nhập
  userName?: string;    // tên hiển thị user
  userAvatar?: string;  // avatar user
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    clientId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String },
    userAvatar: { type: String },
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

ChatSchema.index({ clientId: 1, userId: 1 }, { unique: true });

export const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);
