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

console.log("🔑 Razorpay Keys:", {
  id: process.env.RAZORPAY_KEY_ID,
  secret: process.env.RAZORPAY_KEY_SECRET ? "✅ Loaded" : "❌ Missing",
});

// Define Subscription Plans
const PLANS = {
  plan_1: {
    name: "Basic",
    credits: 100,
    price: 500,
    duration: 1, // months
    type: "basic",
  },
  plan_2: {
    name: "Standard",
    credits: 300,
    price: 1200,
    duration: 3,
    type: "standard",
  },
  plan_3: {
    name: "Premium",
    credits: 600,
    price: 2000,
    duration: 6,
    type: "premium",
  },
};

// 📌 Create Razorpay Order
router.post("/create", async (req, res) => {
  try {
    const { customer_id, plan_id } = req.body;

    console.log("➡️ Received:", { customer_id, plan_id });

    if (!customer_id || !plan_id || !PLANS[plan_id]) {
      console.warn("❌ Invalid customer_id or plan_id");
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan or customer ID" });
    }

    const plan = PLANS[plan_id];
    console.log("📦 Plan matched:", plan);

    const shortCustomerId = customer_id.slice(0, 8); // Use first 8 chars for brevity
    const receiptId = `ord_${shortCustomerId}_${Date.now()}`.slice(0, 40);

    const options = {
      amount: plan.price * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: order.id,
        amount: plan.price,
        currency: "INR",
      },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Try again later.",
      error: error.message,
    });
  }
});

// 📌 Verify Payment & Update Subscription
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer_id,
      plan_id,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !customer_id ||
      !PLANS[plan_id]
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment details" });
    }

    // Verify Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const plan = PLANS[plan_id];
    const user = await User.findOne({ customer_id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Calculate Expiry Date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(currentDate.getMonth() + plan.duration);

    // Update User Subscription Details
    user.credits += plan.credits;
    user.purchase_date = currentDate;
    user.expiry_date = expiryDate;
    user.subscription_type = plan.type; // "basic", "standard", or "premium"
    user.premium = plan.type === "premium" ? "Yes" : "No"; // Optional legacy flag

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified & subscription updated successfully",
      data: {
        credits: user.credits,
        subscription_type: user.subscription_type,
        expiry_date: user.expiry_date,
        premium: user.premium,
      },
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error. Try again later." });
  }
});

// 📌 Check Subscription Status
router.get("/status/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const user = await User.findOne({ customer_id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPremium =
      user.credits > 0 || new Date(user.expiry_date) > new Date();
    user.premium = isPremium ? "Yes" : "No";

    // Don't override existing subscription_type unless expired
    if (!isPremium) {
      user.subscription_type = "free";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription status fetched successfully",
      data: {
        credits: user.credits,
        expiry_date: user.expiry_date,
        premium: user.premium,
        subscription_type: user.subscription_type,
      },
    });
  } catch (error) {
    console.error("❌ Error checking subscription status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;
