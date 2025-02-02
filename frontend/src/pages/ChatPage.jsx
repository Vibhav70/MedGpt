import { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import MessageInput from '../components/MessageInput';
import Header from '../components/Header';
import Welcome from '../components/Welcome';

const API_URL = "http://127.0.0.1/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [displayedText, setDisplayedText] = useState('');

  const animateBotReply = async (botReply) => {
    if (!botReply) return;
    let displayed = '';
    const words = botReply.split(" ");
    for (let i = 0; i < words.length; i++) {
      displayed += (i > 0 ? ' ' : '') + words[i];
      setDisplayedText(displayed);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, { text: userInput, isUser: true }];
    setMessages(updatedMessages);
    setDisplayedText(''); // Reset displayed text before new message
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, { user_input: userInput }, {
        headers: { "Content-Type": "application/json" }
      });

      const botReply = response.data.answer;
      setMessages([...updatedMessages, { text: botReply, isUser: false }]);
      animateBotReply(botReply);

      const newChatEntry = {
        title: userInput.length > 10 ? userInput.slice(0, 10) + '...' : userInput,
        date: new Date().toLocaleDateString()
      };
      setChatHistory((prev) => [...prev, newChatEntry]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...updatedMessages, { text: "Error getting response.", isUser: false }]);
    }
    setIsLoading(false);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} chatHistory={chatHistory} />

      <div className={`flex flex-col flex-1 bg-white transition-all duration-300 ${sidebarExpanded ? 'ml-16' : 'ml-2'}`}>
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />

        <div className="flex-grow">
          {messages.length === 0 ? (
            <Welcome onPromptClick={sendMessage} />
          ) : (
            <ChatArea messages={messages} displayedText={displayedText} />
          )}
        </div>

        <MessageInput onSendMessage={sendMessage} sidebarExpanded={sidebarExpanded} isLoading={isLoading} />
      </div>
    </div>
  );
}
