import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import Loader from '../components/Loader'; // Importing the loader
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

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll p-1 mt-16 md:p-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex md:mb-4 ${msg.isUser ? 'justify-end' : ''}`}>
          {!msg.isUser && (
            <div className='min-w-8'>
              <img src={logo} alt="Bot Logo" className="h-10 w-8 mr-1 md:mr-2 mt-2 rounded-full bg-white" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-full text-md leading-7 ${msg.isUser ? 'text-blue-800 p-4 bg-blue-100 rounded-tr-md' : 'text-white max-w-[800px]'}`}
          >
            {msg.isUser ? msg.text : <ReactMarkdown>{index === messages.length - 1 ? displayedText : msg.text}</ReactMarkdown>}
          </motion.div>
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
