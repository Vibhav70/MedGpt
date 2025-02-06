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
          `${API_URL}/api/chats/customer/${user.customer_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
  
        if (Array.isArray(response.data.data)) {
          // Ensure chat titles are assigned correctly
          const formattedChats = response.data.data.map((chat) => ({
            title: chat.query.length > 25 ? chat.query.slice(0, 25) + "..." : chat.query,
            date: new Date(chat.date).toLocaleDateString(),
            messages: [{ text: chat.query, isUser: true }, { text: chat.response, isUser: false }],
          }));
  
          setChatHistory(formattedChats);
        } else {
          setChatHistory([]); // Ensure empty array if data is not in expected format
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChatHistory([]);
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
    setDisplayedText("");
    setIsLoading(true);
  
    try {
      // 🔹 STEP 1: Get response from AI Model
      const llmResponse = await axios.post("http://127.0.0.1/chat", { user_input: userInput });
      const botReply = llmResponse.data.answer || "No response received.";
  
      // Append AI response to UI
      const newMessages = [...updatedMessages, { text: botReply, isUser: false }];
      setMessages(newMessages);
  
      // 🔹 STEP 2: Store chat history in MongoDB
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/chats`,
        {
          customer_id: user.customer_id,
          query: userInput,
          response: botReply,
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
  
      // 🔹 STEP 3: Update chat history & credits
      setChatHistory((prev) => {
        const newEntry = {
          title: userInput.length > 25 ? userInput.slice(0, 25) + "..." : userInput,
          date: new Date().toLocaleDateString(),
          messages: newMessages,
        };
  
        // Avoid duplicate history entries
        const updatedHistory = prev.some(chat => chat.title === newEntry.title)
          ? prev
          : [newEntry, ...prev];
  
        return updatedHistory;
      });
  
      fetchCredits(); // Update credits after sending a message
    } catch (error) {
      console.error("Error fetching chatbot response:", error.response?.data || error.message);
      setMessages([...updatedMessages, { text: "Error getting response.", isUser: false }]);
    }
  
    setIsLoading(false);
  };  
  

  // Load chat when clicked from the history sidebar
  const loadChatFromHistory = (chat) => {
    if (!chat || !chat.messages) return;
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
