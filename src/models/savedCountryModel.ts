import mongoose, { Schema, Document } from "mongoose";

export interface ISavedCountry extends Document {
  user: mongoose.Types.ObjectId;
  countryCode: string;
}

const savedCountrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  countryCode: { type: String, required: true },
});

// Prevent duplicate saves for the same user
savedCountrySchema.index({ user: 1, countryCode: 1 }, { unique: true });


export default mongoose.model<ISavedCountry>("SavedCountry", savedCountrySchema);
