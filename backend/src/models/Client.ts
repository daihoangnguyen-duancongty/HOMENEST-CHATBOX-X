import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  clientId: string;
  name: string;
  domain?: string;
  color?: string;
  logo_url?: string;
  welcome_message?: string;
  ai_provider: string; // default AI provider
  user_count?: number;
  created_at: Date;
  meta?: Record<string, any>;
  api_keys?: {
    openai?: string;
    claude?: string;
    gemini?: string;
    [key: string]: string | undefined;
  };
    // 🔹 Thêm các field mới
  active?: boolean;
  trial?: boolean;
  trial_end?: Date;
}

const ClientSchema: Schema<IClient> = new Schema({
  clientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String },
  color: { type: String, default: '#0b74ff' },
  logo_url: { type: String },
  welcome_message: { type: String, default: 'Xin chào! Mình có thể giúp gì?' },
  ai_provider: { type: String, default: 'openai' },
  api_keys: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed, default: {} },
  user_count: { type: Number, default: 0 },
    // 🔹 Thêm trial & active
  active: { type: Boolean, default: true },
  trial: { type: Boolean, default: true },
  trial_end: { type: Date },
});

ClientSchema.index({ domain: 1 });

export const ClientModel: Model<IClient> = mongoose.model<IClient>('Client', ClientSchema);
