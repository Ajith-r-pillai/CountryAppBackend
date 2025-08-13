import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; // explicitly define _id type
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
