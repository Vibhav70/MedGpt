import HeaderMain from "../components/HeaderMain";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-[#edfdff] via-[#f4fffa] to-[#efffff] min-h-screen flex flex-col items-center text-black pt-6 pb-12">
      <HeaderMain />
      <section className="text-center py-20 px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg animate-fade-in">MedBookGPT</h1>
        <p className="text-xl md:text-2xl mt-6 opacity-95 max-w-2xl mx-auto leading-relaxed">
          Your AI-Powered Medical Study Companion. Get direct references and answers to all your textbook questions instantly.
        </p>
        <Link to="/login"><button className="mt-8 bg-[#13c2dd] text-white px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-[#16a0a0] transition-all duration-300 transform hover:scale-105">
          Get Started
        </button></Link>
      </section>
      
      <section className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full mt-12 text-gray-800">
        <h2 className="text-4xl font-bold text-center text-blue-700">Why Choose MedBookGPT?</h2>
        <ul className="mt-8 space-y-5 text-xl">
          <li className="flex items-center gap-4"><span className="text-blue-500 text-3xl">🔍</span> Instant answers to textbook queries</li>
          <li className="flex items-center gap-4"><span className="text-blue-500 text-3xl">📚</span> Reliable, reference-backed information</li>
          <li className="flex items-center gap-4"><span className="text-blue-500 text-3xl">🩺</span> Tailored for medical students</li>
          <li className="flex items-center gap-4"><span className="text-blue-500 text-3xl">⚡</span> Saves time on research & note-making</li>
        </ul>
      </section>
      
      {/* <section className="max-w-3xl mt-14 text-center bg-white p-8 rounded-2xl shadow-2xl text-gray-900">
        <h2 className="text-4xl font-bold text-blue-700">Trusted by Medical Students</h2>
        <p className="text-xl mt-6 italic">&quot;MedBookGPT has been a lifesaver for my studies! Fast, reliable, and super helpful.&quot;</p>
        <p className="text-gray-700 mt-4 font-semibold">- Alex, Medical Student</p>
      </section> */}
    </div>
  );
};

export default LandingPage;
