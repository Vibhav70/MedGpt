import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionPage from "./pages/SubscriptionPage";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<SubscriptionPage />} />
        {/* ✅ Protect chat route */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
