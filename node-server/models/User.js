const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Change from username to email
  password: { type: String, required: true }, // Hashed passwords
  customer_id: { type: String, unique: true, required: true },
  credits: { type: Number, default: 5 }, // Default credits
});

module.exports = mongoose.model("User", UserSchema);
