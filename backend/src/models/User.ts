import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  userId: string;
  clientId: string;
  username: string;
  password: string;
  name: string;
  avatar?: string;
  api_key?: string;
  role: 'admin' | 'client' | 'employee';
  created_at: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  userId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  api_key: { type: String },

  role: { type: String, enum: ['admin', 'client', 'employee'], default: 'employee' },
  created_at: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
