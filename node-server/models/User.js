const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash passwords in production
  customer_id: { type: String, unique: true, required: true },
  credits: { type: Number, default: 5 }, // Default credits
});

module.exports = mongoose.model("User", UserSchema);
