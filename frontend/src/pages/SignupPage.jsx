import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await signup(email, password);
    if (response.success) {
      navigate("/login");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#edfdff] via-[#f4fffa] to-[#efffff] p-6">
      <div className="bg-white/40 backdrop-blur-lg border border-white/50 shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Your Account</h1>

        {error && (
          <p className="bg-red-500 text-white text-sm rounded-lg py-2 px-4 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <input
            className="w-full p-3 bg-white/70 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 bg-white/70 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 active:scale-95"
          >
            Register
          </button>
        </form>

        <p className="text-gray-700 text-center mt-5">
          Already have an account?
          <Link to="/login" className="text-green-600 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
