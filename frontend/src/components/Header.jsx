import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbCoinMoneroFilled } from "react-icons/tb";

export default function Header({ sidebarExpanded, toggleSidebar, credits }) {
  return (
    <div className="flex justify-between items-center bg-transparent text-black px-3 py-4 h-16 fixed top-0 left-0 z-30 w-full shadow-sm transition-all duration-300">
      {/* Toggle button for Sidebar */}
      <div className="relative">
        <button className="bg-[#E6E0E9] text-black shadow-sm shadow-gray-500 p-3 rounded-lg transition-transform duration-500" onClick={toggleSidebar}>
          {sidebarExpanded ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
        </button>
      </div>

      <div className="flex gap-5">
        {/* Credits Display */}
        <div className="flex items-center space-x-3">
          <span className="flex gap-1 text-xl font-semibold text-white border border-1 border-gray-200 rounded-md px-2 py-1">
            {credits !== null ? credits : "Loading..."} <TbCoinMoneroFilled size="28" className="text-yellow-600 " />
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4 cursor-pointer">
          <Link to="/">
            <img src="/user.png" alt="User Profile" className="h-10 w-10 rounded-full" />
          </Link>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  credits: PropTypes.number, // Receive credits as prop
};
