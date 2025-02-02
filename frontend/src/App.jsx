import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./App.css"
// import AboutUs from "./pages/AboutUs";
// import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AuthProvider from "./context/AuthProvider";

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<LoginPage />} /> */}
        <Route
          path="/chat"
          element={
              <ChatPage />
          }
        />
      </Routes>
    </Router>
);

export default App;