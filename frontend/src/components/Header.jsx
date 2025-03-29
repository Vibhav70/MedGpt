import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbCoinMoneroFilled } from "react-icons/tb";

export default function Header({ sidebarExpanded, toggleSidebar, credits }) {
  return (
    <div className="flex justify-between items-center fixed top-0 left-0 z-30 w-full px-4 md:px-6 py-3 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="bg-white shadow border border-gray-200 hover:shadow-md text-gray-700 p-2.5 rounded-lg transition-transform duration-300 active:scale-95"
        title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {sidebarExpanded ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Credits */}
        <div className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-gray-800 font-semibold text-sm md:text-base">
          <TbCoinMoneroFilled size={22} className="text-yellow-500 mr-2" />
          {credits !== null ? credits : "Loading..."}
        </div>

        {/* User Avatar */}
        <Link to="/" title="Go to Home">
          <img
            src="/user.png"
            alt="User"
            className="h-10 w-10 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition duration-200"
          />
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  credits: PropTypes.number,
};
