import { Link } from "react-router-dom";

import { FaUserTie } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";

export default function HeaderMain() {
  return (
    <header>
    <div className="flex justify-between items-center rounded-b-2xl bg-transparent border border-b-1 border-black text-black px-3 md:px-6 py-4 h-16 fixed top-0 left-0 z-30 w-full shadow-sm transition-all duration-300 backdrop-blur-lg">
      <img src='/aadi.png' className="h-8 w-8" />
        <div className="flex gap-2 md:gap-5 items-end">
            <Link to="chat"><TbMessageChatbotFilled className="h-8 w-8 text-blue-400" /></Link>
            <FaUserTie className="h-8 w-8 text-pink-400" />
        </div>
    </div>
    </header>
  );
}
