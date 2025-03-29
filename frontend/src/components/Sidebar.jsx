import PropTypes from 'prop-types';

export default function Sidebar({ isExpanded, chatHistory = [], loadChatFromHistory }) {
  return (
    <div
      className={`h-screen bg-white/80 backdrop-blur-md text-gray-800 transition-all duration-300 fixed top-0 left-0 z-20 shadow-md border-r border-gray-200 ${
        isExpanded ? 'w-64' : 'w-0 md:w-16'
      } overflow-hidden`}
    >
      {isExpanded && (
        <div className="px-4 pt-24">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Chat History</h2>

          <ul className="space-y-3 h-[65vh] overflow-y-auto pr-2 custom-scroll">
            {chatHistory.length === 0 ? (
              <li className="text-gray-500">No chat history found.</li>
            ) : (
              [...chatHistory].reverse().map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => loadChatFromHistory(chat)}
                  className="cursor-pointer bg-white/60 hover:bg-green-100 transition-all duration-200 border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm"
                >
                  <div className="font-semibold truncate">{chat.title || "Untitled Chat"}</div>
                  <div className="text-[11px] text-gray-500 text-right">
                    {chat.date || "Unknown Date"}
                  </div>
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
      _id: PropTypes.string,
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
