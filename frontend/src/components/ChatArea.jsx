import PropTypes from "prop-types";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useEffect, useState, useRef } from "react";
// import Loader from "../components/Loader";
import { FaCopy, FaVolumeUp, FaPause } from "react-icons/fa";
import logo from "/bot1.png";

export default function ChatArea({ messages, isLoading, newBotResponse }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const chatRefs = useRef({});
  const [isNewResponse, setIsNewResponse] = useState(false);
  const isAnimating = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!newBotResponse || isAnimating.current) return;

    isAnimating.current = true;
    setIsNewResponse(true);

    try {
      const parsedResponse = JSON.parse(newBotResponse);

      const formattedResponses = parsedResponse.answers
      .map((answer, index) => {
        const cleanedTitle = answer.book_title.trim().replace(/\s+/g, ' '); // Remove extra spaces
        return `**${index + 1}. ${cleanedTitle}**\n*by ${answer.author.trim()}*  \n\n${answer.response.trim()}`;
      })
      .join('\n\n---\n\n');
    
      // Ensures proper spacing

      const words = formattedResponses.split(" ");
      let index = 0;

      const typeWordByWord = () => {
        if (index < words.length) {
          setDisplayedText(
            (prev) => prev + (index > 0 ? " " : "") + words[index]
          );
          index++;
          setTimeout(typeWordByWord, 10); // Adjust speed
        } else {
          setIsNewResponse(false);
          isAnimating.current = false;
        }
      };

      setDisplayedText("");
      typeWordByWord();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      setDisplayedText(newBotResponse);
      setIsNewResponse(false);
      isAnimating.current = false;
    }
  }, [newBotResponse]);

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll no-scrollbar p-4 mt-20 md:p-6">
    {messages.map((msg, index) => (
      <div
        key={index}
        ref={(el) => (chatRefs.current[index] = el)}
        className={`flex md:mb-6 ${msg.isUser ? "justify-end" : "justify-start"}`}
      >
        {/* Bot Avatar */}
        {!msg.isUser && (
          <div className="min-w-8">
            <img
              src={logo}
              alt="Bot Logo"
              className="h-10 w-10 mr-3 mt-2 rounded-full bg-white shadow"
            />
          </div>
        )}
  
        {/* Message bubble */}
        <div className="flex flex-col gap-3 max-w-[90%]">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-3 rounded-2xl text-[16px] leading-7 shadow-md whitespace-pre-line ${
              msg.isUser
                ? "bg-[#e0f2ff] text-blue-900 rounded-tr-sm ml-12"
                : " text-gray-800 border border-gray-200 rounded-tl-md"
            }`}
          >
            <ReactMarkdown>
              {msg.isUser
                ? msg.text
                : msg.text === newBotResponse && isNewResponse
                ? displayedText
                : msg.text}
            </ReactMarkdown>
          </motion.div>
  
          {/* Copy & Listen Buttons */}
          {!msg.isUser && (
            <div className="flex gap-4 ml-2 text-sm">
              <button
                className="flex items-center gap-2 active:scale-95 hover:scale-105 px-3 py-1 rounded-md text-green-700 hover:bg-green-100 transition"
                onClick={() => navigator.clipboard.writeText(msg.text)}
              >
                <FaCopy size={16} />
                <span className="hidden md:inline">Copy</span>
              </button>
  
              <button
                className="flex items-center gap-2 active:scale-95 hover:scale-105 px-3 py-1 rounded-md text-blue-600 hover:bg-blue-100 transition"
                onClick={() => {
                  if (isSpeaking) {
                    speechSynthesis.cancel();
                    setIsSpeaking(false);
                  } else {
                    const utterance = new SpeechSynthesisUtterance(msg.text);
                    utterance.rate = 1;
                    utterance.pitch = 1;
                    utterance.volume = 1;
                    utterance.onend = () => setIsSpeaking(false);
                    speechSynthesis.speak(utterance);
                    setIsSpeaking(true);
                  }
                }}
              >
                {isSpeaking ? <FaPause size={16} /> : <FaVolumeUp size={16} />}
                <span className="hidden md:inline">
                  {isSpeaking ? "Pause" : "Listen"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  
    {/* Loader while bot is thinking */}
    {isLoading && (
      <div className="flex items-center gap-3 mt-6 ml-1">
        <img
          src={logo}
          alt="Bot Logo"
          className="h-10 w-10 rounded-full shadow"
        />
        <div className="text-gray-500 italic animate-pulse">Thinking...</div>
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
  newBotResponse: PropTypes.string,
};
