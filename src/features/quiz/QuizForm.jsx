const QuizForm = ({
  question,
  currentIndex,
  totalQuestions,
  handleOptionClick,
}) => {
  return (
    <div className="bg-white p-6 shadow-2xl rounded-xl w-full text-center">
      <h2 className="text-2xl font-bold text-gray-700">
        Question {currentIndex + 1} of {totalQuestions}
      </h2>
      <p className="text-gray-600 mt-4 text-lg">{question?.question}</p>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {question?.options.map((option, index) => (
          <button
            key={index}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-md"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizForm;
