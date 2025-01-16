const User = require("../models/User");
const generateCustomerId = require("../utils/generateId");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      const customer_id = generateCustomerId();
      user = await User.create({ username, password, customer_id });
    }
    res.status(200).json({ customer_id: user.customer_id });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = { loginUser };
