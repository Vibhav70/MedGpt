import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import Loader from '../components/Loader';
import { FaCopy, FaVolumeUp, FaPause } from "react-icons/fa"; // Import icons
import logo from "/bot1.png";

export default function ChatArea({ messages, isLoading, activeChat }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const chatRefs = useRef({}); // Store refs for each message

  const animateBotReply = (text) => {
    if (!text) return;
    let displayed = '';
    const words = text.split(' ');
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        displayed += (index > 0 ? ' ' : '') + words[index];
        setDisplayedText(displayed);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust typing speed for smooth animation
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      animateBotReply(lastMessage.text);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Scroll to the active chat when it's loaded
  useEffect(() => {
    if (activeChat && chatRefs.current[activeChat]) {
      chatRefs.current[activeChat].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeChat]);

  // Copy the bot's response text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Toggle speech synthesis (Play/Pause)
  const toggleSpeech = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll p-2 mt-16 md:p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={(el) => (chatRefs.current[index] = el)} // Store reference for each message
          className={`flex md:mb-4 ${msg.isUser ? 'justify-end' : ''}`}
        >
          {!msg.isUser && (
            <div className='min-w-8'>
              <img src={logo} alt="Bot Logo" className="h-10 w-8 mr-1 md:mr-2 mt-2 rounded-full bg-white" />
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-2xl text-md leading-7 shadow-md ${
                msg.isUser ? 'text-blue-800 px-4 py-3 bg-blue-100 rounded-tr-sm ml-12' 
                : 'text-white px-4 py-3 rounded-tl-sm max-w-[800px] overflow-x-auto text-wrap'
              }`}
            >
              {msg.isUser 
                ? msg.text 
                : <ReactMarkdown>{index === messages.length - 1 ? displayedText : msg.text}</ReactMarkdown>
              }
            </motion.div>

            {/* Copy and Listen Buttons */}
            {!msg.isUser && (
              <div className="flex gap-3 ml-3">
                <button
                  className="flex items-center gap-2 active:scale-95 hover:scale-105 p-2 rounded-md text-[#ff8b37] text-sm transition-all"
                  onClick={() => copyToClipboard(index === messages.length - 1 ? displayedText : msg.text)}
                >
                  <FaCopy size={18} /> <span className="hidden md:inline">Copy</span>
                </button>

                <button
                  className="flex items-center gap-2 active:scale-95 hover:scale-105 p-2 rounded-md text-[#43efff] text-sm transition-all"
                  onClick={() => toggleSpeech(index === messages.length - 1 ? displayedText : msg.text)}
                >
                  {isSpeaking ? <FaPause size={18} /> : <FaVolumeUp size={18} />}
                  <span className="hidden md:inline">{isSpeaking ? "Pause" : "Listen"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Show Loader when the bot is generating a response */}
      {isLoading && (
        <div className="flex items-center gap-2 mt-4">
          <img src={logo} alt="Bot Logo" className="h-10 w-8 mr-1 md:mr-2 mt-2 rounded-full" />
          <Loader />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

ChatArea.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      isUser: PropTypes.bool.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeChat: PropTypes.number, // New prop for identifying the active chat index
};
