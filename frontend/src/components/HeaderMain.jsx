import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function HeaderMain() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 z-30 w-full px-4 md:px-8 py-3 bg-white/70 backdrop-blur-md border-b border-gray-300 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/aadi.png" alt="Logo" className="h-10 w-10 rounded-xl" />
          <span className="font-bold text-xl text-gray-800 hidden sm:inline">MedBookGPT</span>
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            to="/pricing"
            className="text-gray-700 hover:text-blue-500 transition font-medium"
          >
            Pricing
          </Link>

          <Link
            to="/chat"
            className="text-blue-500 hover:text-blue-600 transition"
            title="Chat Assistant"
          >
            <TbMessageChatbotFilled className="h-7 w-7" />
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-all duration-200 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-pink-500 hover:text-pink-600 transition"
              title="Login"
            >
              <FaUserTie className="h-7 w-7" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
