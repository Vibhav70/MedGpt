import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import profile from "/aadi.png";
import logo from "/aadi.png";
import { useEffect, useState, useRef } from 'react';

export default function ChatArea({ messages }) {
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
  }, [messages]);

  return (
    <div className="h-[80vh] max-w-4xl m-auto overflow-y-scroll p-1 mt-16 md:p-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex md:mb-4`}>
          {!msg.isUser && (
            <div className='min-w-8'>
                <img src={logo} alt="Bot Logo" className="h-8 w-8 mr-1 md:mr-2 mt-2 rounded-full" />
            </div>
          )}

          {msg.isUser && (
                <img src={profile} alt="User Profile" className="h-8 w-8 mr-1 md:mr-2 mt-2 rounded-full" />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-lg ${msg.isUser ? 'text-blue-800' : 'text-black max-w-[800px]'}`}
          >
            {msg.isUser ? msg.text : <ReactMarkdown>{index === messages.length - 1 ? displayedText : msg.text}</ReactMarkdown>}
          </motion.div>
        </div>
      ))}
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
};
