import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, credits, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">MedGPT</h1>
      <nav>
        <Link className="mr-4" to="/">Home</Link>
        <Link className="mr-4" to="/about">About Us</Link>
        {user && <Link className="mr-4" to="/chat">Chat</Link>}
      </nav>
      <div>
        {user ? (
          <>
            <span className="mr-4">Credits: {credits}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-500 px-2 py-1">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
