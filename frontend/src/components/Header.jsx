import PropTypes from 'prop-types';
import { MdMenu, MdClose } from "react-icons/md";

export default function Header({ sidebarExpanded, toggleSidebar }) {
  return (
    <div className="flex justify-between items-center bg-white text-black px-3 md:px-6 py-4 h-16 fixed top-0 left-0 z-30 w-full shadow-sm transition-all duration-300">
      {/* Toggle button for Sidebar */}
      <div className="relative">
        <button
          className="bg-[#E6E0E9] text-black shadow-sm shadow-gray-500 p-3 rounded-lg transition-transform duration-300"
          onClick={toggleSidebar}
        >
          {sidebarExpanded ? <MdClose size={18} /> : <MdMenu size={18} />}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-4 cursor-pointer">
        <img
          src="/aadi.png"
          alt="User Profile"
          className="h-10 w-10 rounded-full border-gray-400 border-2"
        />
      </div>
    </div>
  );
}

Header.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};
