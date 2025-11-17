import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  userId: string;
  username: string;
  password: string;
  name: string;
  avatar?: string;
  role: "admin";
  created_at: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema: Schema<IAdmin> = new Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: null },
  role: { type: String, default: "admin" },
  created_at: { type: Date, default: Date.now },
});

// Method so sánh password
AdminSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
