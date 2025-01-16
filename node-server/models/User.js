const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash passwords
  customer_id: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("User", UserSchema);
