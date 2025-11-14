import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  clientId: string;         // ID duy nhất do WP plugin tạo (32 chars)
  name: string;             // Tên client
  domain?: string;          // Domain khách hàng
  color?: string;           // Màu chính cho widget
  logo_url?: string;        // URL logo
  welcome_message?: string; // Welcome message cho widget
  ai_provider: string;      // 'openai' | 'claude' | 'gemini'
  created_at: Date;
  meta?: Record<string, any>;
   user_count?: number;
}

// Schema
const ClientSchema: Schema<IClient> = new Schema({
  clientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String },
  color: { type: String, default: '#0b74ff' },
  logo_url: { type: String },
  welcome_message: { type: String, default: 'Xin chào! Mình có thể giúp gì?' },
  ai_provider: { type: String, default: 'openai' },
  created_at: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed, default: {} },
   user_count: { type: Number, default: 0 }, 
});

// Optional index theo domain
ClientSchema.index({ domain: 1 });

// Export tên đồng bộ với controller
export const ClientModel: Model<IClient> = mongoose.model<IClient>('Client', ClientSchema);
