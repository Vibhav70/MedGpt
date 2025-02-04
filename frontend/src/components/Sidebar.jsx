import PropTypes from 'prop-types';

export default function Sidebar({ isExpanded, chatHistory, loadChatFromHistory }) {
  return (
    <div
      className={`h-screen bg-[#f9efff] text-gray-700 transition-all duration-300 fixed top-0 left-0 z-10 ${
        isExpanded ? 'w-64' : 'w-0 md:w-16'
      } overflow-hidden`}
    >
      {isExpanded && (
        <div className="px-4 pt-24">
          <h2 className="text-2xl font-bold">Chat History</h2>
          <ul className="mt-4 space-y-4">
            {chatHistory.map((chat, index) => (
              <li 
                key={index} 
                className="cursor-pointer p-2 hover:border-black hover:border rounded-md transition-all duration-200"
                onClick={() => loadChatFromHistory(chat)} // Load chat when clicked
              >
                <div className="font-bold">{chat.title}</div>
                <div className="text-sm text-gray-500">{chat.date}</div>
              </li>
            ))}
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
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          isUser: PropTypes.bool.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  loadChatFromHistory: PropTypes.func.isRequired, // New function to load chat
};
