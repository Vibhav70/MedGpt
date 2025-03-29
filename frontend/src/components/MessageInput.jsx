import PropTypes from 'prop-types';
import { useState } from 'react';
// import { BiSend } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { FaPaperclip } from "react-icons/fa";

export default function MessageInput({ onSendMessage, sidebarExpanded, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSend();
    }
  };

  return (
    <div className={`w-full fixed bottom-0 left-0 transition-all duration-300 ${sidebarExpanded ? 'ml-16' : 'ml-0'}`}>
      <div className="flex items-center bg-[#e8f5e9] text-green-800 rounded-full px-4 py-3 w-[95%] max-w-4xl m-auto mb-2 shadow-sm focus-within:ring-2 ring-green-300 transition-all duration-300">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Let's find some information"
          className="flex-grow bg-transparent text-green-900 placeholder:text-[#436a60] text-[16px] md:text-lg outline-none px-2"
        />
        
        {/* Paperclip icon */}
        {/* <button
          className=" text-green-700 hover:text-green-900 transition"
          title="Attach file"
        >
          <FaPaperclip className="text-[16px]" />
        </button> */}

        {/* Send or Loading icon */}
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-2xl text-green-800 ml-2" />
        ) : (
          <button
            onClick={handleSend}
            className={`ml-2 bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-full font-medium transition-all active:scale-95 ${
              message.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            Send
          </button>
        )}
      </div>

      <p className="text-gray-500 text-center text-[13px] mb-3">I can make mistakes. So double-check it.</p>
    </div>
  );
}

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  sidebarExpanded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
