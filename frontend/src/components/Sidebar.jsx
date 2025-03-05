import PropTypes from 'prop-types';

export default function Sidebar({ isExpanded, chatHistory = [], loadChatFromHistory }) {
  return (
    <div className={`h-screen bg-[#f9efff] text-gray-700 transition-all duration-300 fixed top-0 left-0 z-10 ${
      isExpanded ? "w-64" : "w-0 md:w-16"
    } overflow-hidden`}>
      {isExpanded && (
        <div className="px-4 pt-24">
          <h2 className="text-2xl font-bold text-[#6d1da7]">Chat History</h2>
          <ul className="mt-4 space-y-4 h-[65vh] overflow-y-scroll">
            {chatHistory.length === 0 ? (
              <li className="text-gray-500">No chat history found.</li>
            ) : (
              chatHistory.map((chat) => (
                <li 
                  key={chat._id} // Ensure unique key for React
                  className="cursor-pointer overflow-x-hidden text-nowrap py-1 px-2 hover:bg-[#eee1ff] rounded-md transition-all duration-200 fading-box"
                  onClick={() => loadChatFromHistory(chat)} // Pass chat object with ID
                >
                  <div className="font-bold">{chat.title || "Untitled Chat"}</div>
                  <div className="text-[12px] text-gray-500 text-right">{chat.date || "Unknown Date"}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

Sidebar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          isUser: PropTypes.bool.isRequired,
        })
      ),
    })
  ).isRequired,
  loadChatFromHistory: PropTypes.func.isRequired,
};
