import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import Loader from '../components/Loader';
import { FaCopy, FaVolumeUp, FaPause } from "react-icons/fa"; 
import logo from "/bot1.png";

export default function ChatArea({ messages, isLoading, newBotResponse }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const chatRefs = useRef({}); 
  const [isNewResponse, setIsNewResponse] = useState(false);
  const isAnimating = useRef(false);  // Track if animation is running

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!newBotResponse || isAnimating.current) return; 

    isAnimating.current = true;  // Prevent multiple triggers
    setIsNewResponse(true);

    try {
      const parsedResponse = JSON.parse(newBotResponse);
      const formattedResponse = parsedResponse.answers.map(answer => 
        `**${answer.book_title}** by ${answer.author}\n${answer.response}`
      ).join('\n\n');

      let displayed = '';
      const words = formattedResponse.split(' ');
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          displayed += (index > 0 ? ' ' : '') + words[index];
          setDisplayedText(displayed);
          index++;
        } else {
          clearInterval(interval);
          setIsNewResponse(false);
          isAnimating.current = false;  // Reset animation state
        }
      }, 50); 

      return () => {
        clearInterval(interval);
        isAnimating.current = false; // Reset if component unmounts
      };
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      setDisplayedText(newBotResponse); // Fallback to plain text if parsing fails
      setIsNewResponse(false);
      isAnimating.current = false;
    }
  }, [newBotResponse]);

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll no-scrollbar p-2 mt-16 md:p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={(el) => (chatRefs.current[index] = el)}
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
              <ReactMarkdown>
                {msg.isUser 
                  ? msg.text 
                  : (msg.text === newBotResponse && isNewResponse ? displayedText : msg.text)
                }
              </ReactMarkdown>
            </motion.div>

            {!msg.isUser && (
              <div className="flex gap-3 ml-3">
                <button
                  className="flex items-center gap-2 active:scale-95 hover:scale-105 p-2 rounded-md text-[#ff8b37] text-sm transition-all"
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                >
                  <FaCopy size={18} /> <span className="hidden md:inline">Copy</span>
                </button>

                <button
                  className="flex items-center gap-2 active:scale-95 hover:scale-105 p-2 rounded-md text-[#43efff] text-sm transition-all"
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
                  {isSpeaking ? <FaPause size={18} /> : <FaVolumeUp size={18} />}
                  <span className="hidden md:inline">{isSpeaking ? "Pause" : "Listen"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

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
  newBotResponse: PropTypes.string,
};
