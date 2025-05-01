import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {

  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`);
        const text = await res.text();
        setMessage(text);
      } catch (err) {
        console.log(err);
        setMessage("Verification failed. Please try again later.");
      }
    };

    if (token) verifyEmail();
    else setMessage("Missing verification token.");
  }, [token]);
  

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">Verify Your Email</h1>
        <p className="text-gray-700 mb-4">
          We've sent you a verification email. Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder.</p>
      </div>
    </div>
  );
}
