// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import LandingPage from "./pages/LandingPage";
// import AboutUs from "./pages/AboutUs";
// import LoginPage from "./pages/LoginPage";
// import ChatPage from "./pages/ChatPage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AuthProvider from "./context/AuthProvider";

// const App = () => (
//   <AuthProvider>
//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route
//           path="/chat"
//           element={
//             <ProtectedRoute>
//               <ChatPage />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   </AuthProvider>
// );

// export default App;



import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = async () => {
    if (userInput.trim() === "") {
      alert("Please enter a valid query or topic.");
      return;
    }

    const response = await axios.post("/chat", {
      userInput,
      chatHistory,
    });

    setAnswer(response.data.answer);
    setContext(response.data.context);
    setChatHistory([
      ...chatHistory,
      `User: ${userInput}`,
      `Assistant: ${response.data.answer}`,
    ]);
    setUserInput("");
  };

  return (
    <div>
      <h1>Medical Assistant Chatbot</h1>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter a question or topic..."
      />
      <button onClick={handleSubmit}>Get Answer</button>

      <h2>Answer:</h2>
      <p>{answer}</p>

      <h3>Chat History:</h3>
      <div>
        {chatHistory.map((chat, index) => (
          <p key={index}>{chat}</p>
        ))}
      </div>

      <h3>Retrieved Context:</h3>
      <p>{context}</p>
    </div>
  );
};

export default App;
