import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/verify-email?token=${token}`);
        const data = await res.text();
        setMessage(data);
  
        // Optional: Auto-redirect to login
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.log(err);
        setMessage("Verification failed. Please try again.");
      }
    };
  
    if (token) {
      verifyEmail();
    } else {
      setMessage("No verification token found.");
    }
  }, [token, navigate]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg text-center max-w-sm">
        <h2 className="text-xl font-bold text-green-600 mb-2">Email Verification</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
