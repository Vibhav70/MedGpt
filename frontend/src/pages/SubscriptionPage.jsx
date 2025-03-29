import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import HeaderMain from "../components/HeaderMain";

const PLANS = [
  {
    id: "plan_1",
    name: "Basic",
    duration: "1 Month",
    credits: 100,
    price: 500,
  },
  {
    id: "plan_2",
    name: "Standard",
    duration: "3 Months",
    credits: 300,
    price: 1200,
  },
  {
    id: "plan_3",
    name: "Premium",
    duration: "6 Months",
    credits: 600,
    price: 2000,
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const purchaseSubscription = async () => {
    if (!selectedPlan) return alert("Please select a plan.");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/create`,
        {
          customer_id: user.customer_id,
          plan_id: selectedPlan,
        }
      );

      const { order_id, amount, currency } = response.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,
        currency: currency,
        name: "MedGPT",
        description: "Purchase Subscription",
        order_id: order_id,
        handler: async function (response) {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/subscription/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer_id: user.customer_id,
              plan_id: selectedPlan,
            }
          );
          alert("✅ Payment successful! Credits added.");
        },
        prefill: { email: user.email },
        theme: { color: "#ff8b37" },
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
    <>
      <HeaderMain />
      <div className="min-h-screen bg-white text-gray-800 px-4 py-24 pt-28">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold mb-4 text-center"
        >
          Upgrade to MedLearn Pro
        </motion.h1>
        <p className="text-green-600 text-center mb-12">
          Get unlimited access to our premium features
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full max-w-sm border rounded-xl p-6 shadow-md cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-[#ff8b37] bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold text-black mb-1">
                ₹{plan.price}
              </div>
              <p className="text-sm text-gray-600 mb-4">per {plan.duration}</p>

              <button className="w-full bg-green-100 text-gray-800 font-medium py-2 rounded-md mb-6 hover:bg-green-200 transition">
                {selectedPlan === plan.id ? "Selected" : "Select"}
              </button>

              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  {plan.credits} tokens
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  {Math.floor(plan.credits / 33)} references
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  {Math.ceil(plan.credits / 100)} image upload
                  {Math.ceil(plan.credits / 100) > 1 ? "s" : ""}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  {plan.name === "Premium"
                    ? "High quality "
                    : "Standard quality"}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600 font-bold">✓</span>
                  {plan.name === "Premium"
                    ? "12-hour response time"
                    : "24-hour response time"}
                </li>
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="w-fit m-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 bg-[#ff8b37] px-6 py-3 rounded-lg text-lg text-center font-semibold text-white transition-all duration-300 hover:bg-opacity-90 shadow-md"
            disabled={loading}
            onClick={purchaseSubscription}
          >
            {loading ? "Processing..." : "Purchase Subscription"}
          </motion.button>
        </div>
      </div>
    </>
  );
}
