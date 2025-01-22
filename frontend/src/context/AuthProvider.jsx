import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchCredits();
    }
  }, [token, fetchCredits]);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCredits(data.data.credits);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, credits, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
