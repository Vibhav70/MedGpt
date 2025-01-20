const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash passwords
  customer_id: { type: String, unique: true, required: true },
  credits: { type: Number, default: 5 }, // Default to 5 free credits for trial
});

module.exports = mongoose.model("User", UserSchema);
