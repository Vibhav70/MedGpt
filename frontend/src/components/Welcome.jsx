import PropTypes from 'prop-types';

export default function Welcome({ onPromptClick }) {
  const prompts = [
    "What determines the characteristics of the proteins of the cell?",
    "Give Classification of somatic senses?",
    "Effects of insulin on fat metabolism?",
    "What primary factors affect the rate of diffusion?",
  ];

  return (
    <div className="items-center justify-center w-fit max-w-4xl mx-auto my-32 px-4">
      {/* Heading */}
      <div className="w-full pl-2">
        <h2 className="decor text-4xl md:text-5xl font-bold text-left text-gray-800">
          Hello, Medical Aspirants
        </h2>
        <p className="text-2xl md:text-3xl text-left text-gray-600 mt-2">
          How can I help you today?
        </p>
      </div>

      {/* Prompt Buttons */}
      <div className="flex flex-col md:flex-row flex-wrap justify-start md:justify-center gap-4 mt-10 px-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="bg-[#e8f5e9] hover:bg-[#d3edd9] text-green-900 text-left h-[150px] w-full md:w-[45%] lg:w-[200px] pt-4 pb-12 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-[16px] font-medium leading-snug"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

Welcome.propTypes = {
  onPromptClick: PropTypes.func.isRequired,
};
