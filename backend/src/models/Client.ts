import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  clientId: string;
  name: string;
  domain?: string;
  color?: string;
  logo_url?: string;
  avatar?: string;
  welcome_message?: string;
  ai_provider: string;
  user_count: number;
  created_at: Date;
  meta?: Record<string, any>;
  api_keys?: {
    openai?: string;
    claude?: string;
    gemini?: string;
    [key: string]: string | undefined;
  };
  active?: boolean;
  trial?: boolean;
  trial_end?: Date;
  subscription_plan?: {
    name: string;
    max_users: number;
    max_files?: number;
    price: number;
    [key: string]: any;
  };
}

const ClientSchema: Schema<IClient> = new Schema({
  clientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String },
  color: { type: String, default: '#0b74ff' },
  logo_url: { type: String },
  avatar: { type: String, default: '' },
  welcome_message: { type: String, default: 'Xin chào! Mình có thể giúp gì?' },
  ai_provider: { type: String, default: 'openai' },
  api_keys: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed, default: {} },
  user_count: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  trial: { type: Boolean, default: true },
  trial_end: { type: Date },
  subscription_plan: {
    type: Schema.Types.Mixed,
    default: {
      name: 'Basic',
      max_users: 5,
      max_files: 5,
      price: 0,
    },
  },
});

ClientSchema.index({ domain: 1 });

export const ClientModel: Model<IClient> = mongoose.model<IClient>('Client', ClientSchema);
