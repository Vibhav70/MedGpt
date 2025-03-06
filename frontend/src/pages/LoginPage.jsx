import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      navigate("/chat"); // Redirect to chat after successful login
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#141131] via-[#720b36] to-black p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h1>
        
        {error && (
          <p className="bg-red-500 text-white text-sm rounded-lg py-2 px-4 text-center mb-4">{error}</p>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full pl-10 p-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full pl-10 p-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 active:scale-95"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 text-center mt-5">
          Don&apos;t have an account? 
          <Link to="/signup" className="text-pink-400 hover:underline ml-1">Register</Link>
        </p>
      </div>
    </div>

  );
}
