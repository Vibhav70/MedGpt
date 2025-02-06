import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import MessageInput from "../components/MessageInput";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [displayedText, setDisplayedText] = useState("");
  const [credits, setCredits] = useState(null);

  // Fetch user credits when chat page loads
  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/auth/credits`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCredits(response.data.data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  // Fetch all user chats when ChatPage loads
  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      if (!user) return; // Ensure user is logged in
  
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chats/customer/${user.customer_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
  
        // Ensure chat history is an array
        if (Array.isArray(response.data.data)) {
          setChatHistory(response.data.data);
        } else {
          setChatHistory([]); // Set empty array if response is not in expected format
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChatHistory([]); // Ensure it is still an array if an error occurs
      }
    };

    fetchChatHistory();
    fetchCredits();
  }, [user]);

  // Handle sending message
  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;
  
    const updatedMessages = [...messages, { text: userInput, isUser: true }];
    setMessages(updatedMessages);
    setDisplayedText(""); // Reset displayed text before new message
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/chats`,
        {
          customer_id: user.customer_id,
          query: userInput,
          response: "",
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      // Ensure response is valid
      const botReply = response.data.response || "No response received.";
      const newMessages = [...updatedMessages, { text: botReply, isUser: false }];
  
      // Filter out any undefined or incorrect messages
      const cleanedMessages = newMessages.filter(msg => msg && msg.text !== undefined);
  
      setMessages(cleanedMessages);
  
      // Update chat history with valid messages only
      const newChatEntry = {
        title: userInput.length > 25 ? userInput.slice(0, 25) + "..." : userInput,
        date: new Date().toLocaleDateString(),
        messages: cleanedMessages, // Ensuring no undefined messages
      };
      setChatHistory((prev) => [...prev, newChatEntry]);
  
      // Fetch updated credits after sending a message
      fetchCredits();
    } catch (error) {
      console.error("Error fetching chatbot response:", error.response?.data || error.message);
      setMessages([...updatedMessages, { text: "Error getting response.", isUser: false }]);
    }
  
    setIsLoading(false);
  };  
  

  // Load chat when clicked from the history sidebar
  const loadChatFromHistory = (chat) => {
    setMessages(chat.messages);
    setDisplayedText(chat.messages[chat.messages.length - 1]?.text || "");
  };

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} chatHistory={chatHistory} loadChatFromHistory={loadChatFromHistory} />

      <div className={`flex flex-col flex-1 bg-gradient-to-br from-[#141131] via-[#720b36] to-black transition-all duration-300 ${sidebarExpanded ? "ml-16" : "ml-0"}`}>
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} credits={credits} />

        <div className="flex-grow">
          {messages.length === 0 ? <Welcome onPromptClick={sendMessage} /> : <ChatArea messages={messages} displayedText={displayedText} isLoading={isLoading} />}
        </div>

        <MessageInput onSendMessage={sendMessage} sidebarExpanded={sidebarExpanded} isLoading={isLoading} />
      </div>
    </div>
  );
}
