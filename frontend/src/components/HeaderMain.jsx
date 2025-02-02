import { FaUserTie } from "react-icons/fa";

export default function HeaderMain() {
  return (
    <header>
    <div className="flex justify-between items-center bg-transparent text-black px-3 md:px-6 py-4 h-16 fixed top-0 left-0 z-30 w-full shadow-sm transition-all duration-300 backdrop-blur-sm">
      <img src='/aadi.png' className="h-8 w-8" />
        <div className="flex gap-2">

            <FaUserTie className="h-8 w-8" />
        </div>
    </div>
    </header>
  );
}
