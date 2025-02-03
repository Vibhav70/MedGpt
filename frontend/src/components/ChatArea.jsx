import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import Loader from '../components/Loader'; // Importing the loader
import { FaCopy, FaVolumeUp } from "react-icons/fa"; // Import icons
import logo from "/bot1.png";

export default function ChatArea({ messages, isLoading }) {
  const [displayedText, setDisplayedText] = useState('');
  const bottomRef = useRef(null);

  const animateBotReply = async (text) => {
    if (!text) return;
    let displayed = '';
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      displayed += (i > 0 ? ' ' : '') + words[i];
      setDisplayedText(displayed);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
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

  // Copy the bot's response text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Use Speech Synthesis API to read out the bot's response
  const readOutLoud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Adjust speed if necessary
    utterance.pitch = 1; // Adjust pitch if necessary
    utterance.volume = 1; // Adjust volume if necessary
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll p-1 mt-16 md:p-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex md:mb-4 ${msg.isUser ? 'justify-end' : ''}`}>
          {!msg.isUser && (
            <div className='min-w-8'>
              <img src={logo} alt="Bot Logo" className="h-10 w-8 mr-1 md:mr-2 mt-2 rounded-full bg-white" />
            </div>
          )}

        <div className='flex flex-col gap-2'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-2xl text-md leading-7 ${msg.isUser ? 'text-blue-800 p-4 bg-blue-100 rounded-tr-md ml-12' : 'text-white max-w-[800px]'}`}
          >
            {msg.isUser ? msg.text : <ReactMarkdown>{index === messages.length - 1 ? displayedText : msg.text}</ReactMarkdown>}
          </motion.div>
          {!msg.isUser && (
              <div className="flex gap-3 ml-3">
                <button
                  className="flex items-center gap-2 active:scale-95 text-[#ff8b37] text-sm rounded-md transition-all"
                  onClick={() => copyToClipboard(index === messages.length - 1 ? displayedText : msg.text)}
                >
                  <FaCopy size={22} />
                </button>

                <button
                  className="flex items-center gap-2 active:scale-95 text-[#43efff] text-sm rounded-md transition-all"
                  onClick={() => readOutLoud(index === messages.length - 1 ? displayedText : msg.text)}
                >
                  <FaVolumeUp size={22} />
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
};
