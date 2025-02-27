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
  const [newBotResponse, setNewBotResponse] = useState(null);

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
          // Format chat history correctly
          const formattedChats = response.data.data.map((chat) => ({
            _id: chat._id, // Store the unique chat ID
            title: chat.query.length > 25 ? chat.query.slice(0, 25) + "..." : chat.query,
            date: new Date(chat.date).toLocaleDateString(),
            messages: [
              { text: chat.query, isUser: true },
              { text: chat.response, isUser: false },
            ],
          }));
  
          setChatHistory(formattedChats);
        } else {
          setChatHistory([]);
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
    // 🔹 STEP 1: Check if user has enough credits
    const token = localStorage.getItem("token");
    const creditsResponse = await axios.get(`${API_URL}/api/auth/credits`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    const remainingCredits = creditsResponse.data.data.credits;
    
    if (remainingCredits <= 0) {
      setMessages([...updatedMessages, { text: "⚠️ Out of credits! Please purchase more credits.", isUser: false }]);
      setIsLoading(false);
      return; // Stop execution if credits are zero
    }

    // 🔹 STEP 2: Get AI Response
    const aiResponse = await axios.post("http://127.0.0.1:8000/chat", { user_input: userInput });

    if (!aiResponse.data || !aiResponse.data.answer) {
      throw new Error("Invalid response from AI model");
    }

    const botReply = aiResponse.data.answer; // Actual response from AI

    // Append AI response to UI
    const newMessages = [...updatedMessages, { text: botReply, isUser: false }];
    setMessages(newMessages);

    // 🔹 STEP 3: Store chat in MongoDB
    const saveChatResponse = await axios.post(
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

    if (!saveChatResponse.data.success) {
      throw new Error("Failed to save chat history");
    }

    // 🔹 STEP 4: Update chat history with correct response
    setChatHistory((prev) => [
      {
        title: userInput.length > 21 ? userInput.slice(0, 21) + "..." : userInput,
        date: new Date().toLocaleDateString(),
        messages: newMessages, 
      },
      ...prev,
    ]);

    fetchCredits(); // Update credits after sending a message
    setNewBotResponse(botReply); // Pass latest AI response for animation
  } catch (error) {
    console.error("Error fetching chatbot response:", error.response?.data || error.message);
    setMessages([...updatedMessages, { text: "Error getting response.", isUser: false }]);
  }

  setIsLoading(false);
};  
  

  // Load chat when clicked from the history sidebar
  const loadChatFromHistory = async (chat) => {
    if (!chat || !chat._id) return; // Ensure chat exists
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/chats/${chat._id}`, // Fetch chat by ID
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        const fetchedChat = response.data.data;
        setMessages([
          { text: fetchedChat.query, isUser: true },
          { text: fetchedChat.response, isUser: false },
        ]);
      } else {
        console.error("Failed to fetch chat details");
      }
    } catch (error) {
      console.error("Error loading chat history:", error.response?.data || error.message);
    }
  };  
  

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="flex h-fit min-h-screen">
      <Sidebar isExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} chatHistory={chatHistory} loadChatFromHistory={loadChatFromHistory} />

      <div className={`flex flex-col flex-1 bg-gradient-to-br from-[#141131] via-[#720b36] to-black transition-all duration-300 ${sidebarExpanded ? "ml-16" : "ml-0"}`}>
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} credits={credits} />

        <div className="flex-grow">
          {messages.length === 0 ? <Welcome onPromptClick={sendMessage} /> : <ChatArea messages={messages} displayedText={displayedText} isLoading={isLoading} newBotResponse={newBotResponse}  />}
        </div>

        <MessageInput onSendMessage={sendMessage} sidebarExpanded={sidebarExpanded} isLoading={isLoading} />
      </div>
    </div>
  );
}
