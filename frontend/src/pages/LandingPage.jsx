import HeaderMain from "../components/HeaderMain";
import { Link } from "react-router-dom";
import { Star, BookOpen, Brain, Users } from "lucide-react"; // optional: icons

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-[#edfdff] via-[#f4fffa] to-[#efffff] min-h-screen flex flex-col items-center text-black pt-24 pb-12">
      <HeaderMain />
      <div className="font-sans text-gray-800 w-full">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-none md:shadow-lg max-w-7xl mx-auto">
          <img
            src="https://res.cloudinary.com/do0mocwyc/image/upload/v1743280894/baunew38_gz9fbz.jpg"
            alt="Medical student studying"
            className="w-full max-h-[80vh] object-cover"
          />
          <div className="relative md:absolute inset-0 bg-transparent md:bg-black md:bg-opacity-60 flex flex-col justify-center items-start px-2 pt-4 md:pt-0 md:px-10">
            <div className="relative md:absolute md:bottom-10">
              <h1 className="text-4xl font-extrabold text-black md:text-white mb-4">
                Learn smarter, not harder.
              </h1>
              <p className="text-black md:text-white text-lg max-w-5xl mb-6 leading-relaxed">
                MedBookGPT is a cutting-edge learning platform built for future
                doctors and healthcare pros. Whether you’re prepping for a major
                exam or reviewing core concepts, our AI-powered study tools
                adapt to your strengths and weaknesses — helping you retain more
                in less time.
              </p>
              <p className="text-black md:text-white text-lg max-w-5xl mb-6 leading-relaxed">
                Forget flipping endlessly through textbooks or watching hours of
                lectures. With MedBookGPT, you get high-yield summaries,
                interactive quizzes, smart flashcards, and more — all in one
                place.
              </p>

              <div className="flex gap-4">
                <Link to="/login">
                  <button className="bg-blue-500 text-black md:text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                    Try for Free
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-8 mt-14 md:mt-20 max-w-6xl mx-auto">
          {[
            {
              title: "Smart Summaries",
              icon: <BookOpen className="w-8 h-8 text-blue-600" />,
              desc: "Condensed, AI-generated notes for high-yield retention.",
            },
            {
              title: "Interactive Quizzing",
              icon: <Brain className="w-8 h-8 text-blue-600" />,
              desc: "Practice active recall with tailored questions.",
            },
            {
              title: "Adaptive Learning",
              icon: <Star className="w-8 h-8 text-blue-600" />,
              desc: "The platform learns what you struggle with and adapts.",
            },
            {
              title: "Global Community",
              icon: <Users className="w-8 h-8 text-blue-600" />,
              desc: "Connect with peers and mentors around the world.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start hover:shadow-lg transition cursor-text"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-10 px-6 md:px-8 py-6 md:py-12 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">
            What students are saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                name: "Alex, USMLE Step 1",
                quote:
                  "MedBookGPT turned my weakest subject into my strongest. It’s like having a tutor and a textbook in one.",
              },
              {
                name: "Priya, Med Student",
                quote:
                  "I love how interactive it is. I remember more from 30 minutes here than hours of passive reading.",
              },
              {
                name: "David, Resident",
                quote:
                  "Perfect for quick review on the go. The quizzes are gold.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-green-100 p-6 rounded-lg shadow-sm">
                <p className="text-gray-800 italic mb-2">
                  &apos;&apos;{t.quote}&apos;&apos;
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1 */}

        <div className="px-6 md:px-0 mt-16 max-w-6xl mx-auto text-left">
          <h2 className="text-3xl font-extrabold mb-4">
            What makes MedBookGPT different
          </h2>
          <p className="text-lg mb-6">
            We know that learning medicine is tough. That’s why we’ve built an
            all-in-one study platform that covers every aspect of medical
            education. With MedBookGPT, you can access everything you need to
            succeed in one place.
          </p>
          <Link to="/login">
            <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Try for Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
