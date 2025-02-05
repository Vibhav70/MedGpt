import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import HeaderMain from "./components/HeaderMain";

const App = () => (
  <AuthProvider>
    <Router>
      <HeaderMain />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* ✅ Protect chat route */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
