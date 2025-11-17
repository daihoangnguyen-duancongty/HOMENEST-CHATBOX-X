import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  max_users: number;
  price: number;
  description?: string;
  created_at: Date;
}

const SubscriptionPlanSchema: Schema<ISubscriptionPlan> = new Schema({
  name: { type: String, required: true, unique: true },
  max_users: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const SubscriptionPlanModel: Model<ISubscriptionPlan> = mongoose.model<ISubscriptionPlan>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);
