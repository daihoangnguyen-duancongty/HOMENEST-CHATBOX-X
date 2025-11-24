import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClientFile extends Document {
  clientId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
  metadata?: Record<string, any>;
}

const ClientFileSchema: Schema<IClientFile> = new Schema({
  clientId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['processing', 'ready', 'error'], default: 'processing' },
  metadata: { type: Schema.Types.Mixed, default: {} },
});

export const ClientFileModel: Model<IClientFile> = mongoose.model<IClientFile>(
  'ClientFile',
  ClientFileSchema
);
