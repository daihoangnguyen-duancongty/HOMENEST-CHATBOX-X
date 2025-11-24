import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  max_users: number; // số employee tối đa
  max_files: number; // số file tối đa client có thể gửi train AI
  price: number;
  description?: string;
  created_at: Date;
  [key: string]: any; // cho các tuỳ chọn mở rộng
}

const SubscriptionPlanSchema: Schema<ISubscriptionPlan> = new Schema({
  name: { type: String, required: true, unique: true },
  max_users: { type: Number, required: true },
  max_files: { type: Number, default: 5 },
  price: { type: Number, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const SubscriptionPlanModel: Model<ISubscriptionPlan> = mongoose.model<ISubscriptionPlan>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);
