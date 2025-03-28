const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Subscription Plans (Modify as needed)
const PLANS = {
  plan_1: { credits: 100, price: 500, duration: 1 }, // 1 Month
  plan_2: { credits: 300, price: 1200, duration: 3 }, // 3 Months
  plan_3: { credits: 600, price: 2000, duration: 6 }, // 6 Months
};

// 📌 **Create Razorpay Order**
router.post("/create", async (req, res) => {
  try {
    const { customer_id, plan_id } = req.body;

    if (!customer_id || !plan_id || !PLANS[plan_id]) {
      return res.status(400).json({ success: false, message: "Invalid plan or customer ID" });
    }

    const plan = PLANS[plan_id];

    // Create a Razorpay Order
    const options = {
      amount: plan.price * 100, // Razorpay requires amount in paisa
      currency: "INR",
      receipt: `order_${customer_id}_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: { order_id: order.id, amount: plan.price, currency: "INR" },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// 📌 **Verify Payment & Update User Subscription**
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer_id, plan_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !customer_id || !PLANS[plan_id]) {
      return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    // Verify Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const plan = PLANS[plan_id];

    // Find User & Update Subscription
    const user = await User.findOne({ customer_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Calculate Expiry Date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(currentDate.getMonth() + plan.duration);

    // Update User Subscription Details
    user.credits += plan.credits;
    user.premium = "Yes";
    user.purchase_date = currentDate;
    user.expiry_date = expiryDate;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified & subscription updated successfully",
      data: {
        credits: user.credits,
        premium: user.premium,
        expiry_date: user.expiry_date,
      },
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// 📌 **Check Subscription Status**
router.get("/status/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const user = await User.findOne({ customer_id });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if subscription is active
    const isPremium = user.credits > 0 || new Date(user.expiry_date) > new Date();
    user.premium = isPremium ? "Yes" : "No";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription status fetched successfully",
      data: {
        premium: user.premium,
        credits: user.credits,
        expiry_date: user.expiry_date,
      },
    });
  } catch (error) {
    console.error("❌ Error checking subscription status:", error.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;
