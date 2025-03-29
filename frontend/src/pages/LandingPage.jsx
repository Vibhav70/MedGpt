import HeaderMain from "../components/HeaderMain";
// import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-[#edfdff] via-[#f4fffa] to-[#efffff] min-h-screen flex flex-col items-center text-black pt-6 pb-12">
      <HeaderMain />
      <div className="font-sans text-gray-800">
        {/* Hero Section */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/path-to-your-image.jpg"
            alt="Medical student studying"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start px-10">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Learn smarter, not harder.
            </h1>
            <p className="text-white text-lg max-w-xl mb-6">
              Meducate is the most efficient way to learn medicine. We&apos;ve
              reimagined the textbook and made it interactive, so you can learn
              faster and remember more.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Try for Free
              </button>
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                Watch Video
              </button>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className="px-8 mt-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            What makes Meducate different
          </h2>
          <p className="text-lg mb-6">
            We know that learning medicine is tough. That’s why we’ve built an
            all-in-one study platform that covers every aspect of medical
            education. With Meducate, you can access everything you need to
            succeed in one place.
          </p>
          <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
            Try for Free
          </button>
        </div>

        {/* Section 2 */}
        <div className="px-8 mt-16 mb-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Who uses Meducate</h2>
          <p className="text-lg">
            Meducate is used by students, residents, and healthcare
            professionals around the world. Whether you’re studying for the
            MCAT, USMLE, or any other medical exam, Meducate has everything you
            need to succeed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
