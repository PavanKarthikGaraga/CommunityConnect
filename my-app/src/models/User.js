import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
