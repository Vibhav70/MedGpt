import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { getCredits } from "../utils/api";

const Header = () => {
  const { user, credits, logout } = useContext(AuthContext);

  const refreshCredits = async () => {
    try {
      const res = await getCredits();
      if (res.data.success) {
        alert(`You have ${res.data.data.credits} credits!`);
      }
    } catch (error) {
      console.error("Failed to refresh credits:", error);
    }
  };

  return (
    <header>
      <h1>MedGPT</h1>
      <nav>
        {user && (
          <>
            <span>Credits: {credits}</span>
            <button onClick={refreshCredits}>Refresh Credits</button>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
