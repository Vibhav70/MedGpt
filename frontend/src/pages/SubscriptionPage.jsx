import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const PLANS = [
  { id: "plan_1", name: "Basic", duration: "1 Month", credits: 100, price: 500 },
  { id: "plan_2", name: "Standard", duration: "3 Months", credits: 300, price: 1200 },
  { id: "plan_3", name: "Premium", duration: "6 Months", credits: 600, price: 2000 }
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const purchaseSubscription = async () => {
    if (!selectedPlan) return alert("Please select a plan.");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscription/create`, {
        customer_id: user.customer_id,
        plan_id: selectedPlan
      });

      const { order_id, amount, currency } = response.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,
        currency: currency,
        name: "MedGPT",
        description: "Purchase Subscription",
        order_id: order_id,
        handler: async function (response) {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscription/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            customer_id: user.customer_id,
            plan_id: selectedPlan
          });
          alert("✅ Payment successful! Credits added.");
        },
        prefill: { email: user.email },
        theme: { color: "#ff8b37" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("❌ Error purchasing subscription:", error);
      alert("⚠️ Payment failed, try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#141131] via-[#720b36] to-black text-white px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-4xl font-bold mb-10 md:mb-20 text-center"
      >
        Choose Your Subscription Plan
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {PLANS.map(plan => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)" }}
            transition={{ duration: 0.3 }}
            className={`relative flex flex-col justify-between p-8 bg-white bg-opacity-10 border-2 backdrop-blur-md rounded-xl text-center transition-all duration-300 shadow-lg cursor-pointer ${
              selectedPlan === plan.id ? "border-[#ff8b37] bg-opacity-20" : "border-gray-500"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
            <p className="text-lg text-gray-300">{plan.duration}</p>
            <p className="text-2xl font-bold my-3">{plan.credits} Tokens</p>
            <p className="text-xl font-semibold text-[#ff8b37]">₹{plan.price}</p>
            
            {selectedPlan === plan.id && (
              <div className="absolute top-3 right-3 bg-[#ff8b37] text-white px-2 py-1 text-xs font-semibold rounded-full">
                Selected
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 md:mt-16 bg-[#ff8b37] px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-opacity-80 shadow-md"
        disabled={loading}
        onClick={purchaseSubscription}
      >
        {loading ? "Processing..." : "Purchase Subscription"}
      </motion.button>
    </div>
  );
}
