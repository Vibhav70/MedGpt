const Razorpay = require("razorpay");
const User = require("../models/User");

// Set up Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Subscription Plans
const PLANS = [
  { id: "plan_1", duration: 1, credits: 100, price: 500 }, // 100 tokens, ₹500 for 1 month
  { id: "plan_2", duration: 3, credits: 300, price: 1200 }, // 300 tokens, ₹1200 for 3 months
  { id: "plan_3", duration: 6, credits: 600, price: 2000 }  // 600 tokens, ₹2000 for 6 months
];

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, plan_id } = req.body;

    if (!customer_id || !plan_id) {
      return res.status(400).json({ success: false, message: "Customer ID and plan ID are required" });
    }

    const plan = PLANS.find((p) => p.id === plan_id);
    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid plan selected" });
    }

    const options = {
      amount: plan.price * 100, // Razorpay works in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `order_${customer_id}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: order.id,
        amount: plan.price,
        currency: "INR",
        customer_id,
        plan_id
      }
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer_id, plan_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !customer_id || !plan_id) {
      return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    const plan = PLANS.find((p) => p.id === plan_id);
    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid plan selected" });
    }

    // Find user
    const user = await User.findOne({ customer_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user with credits and plan details
    user.credits += plan.credits;
    user.purchase_date = new Date();
    user.plan_duration = plan.duration;
    user.checkPremiumStatus();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment successful and credits added",
      data: { credits: user.credits, premium: user.premium }
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
