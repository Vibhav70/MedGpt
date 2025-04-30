const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  customer_id: { type: String, unique: true, required: true },
  credits: { type: Number, default: 5 },
  subscription_type: {
    type: String,
    enum: ["free", "basic", "standard", "premium"],
    default: "free"
  },
  isVerified: { type: Boolean, default: false },
  purchase_date: { type: Date },
  expiry_date: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
