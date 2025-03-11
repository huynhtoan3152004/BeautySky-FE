import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resultAPI from "../services/result";

const QuizResult = ({ quizData }) => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const response = await resultAPI.createQuiz(quizData);
        if (response.status >= 200 && response.status < 300) {
          setResult(response.data);
        }
      } catch (error) {
        console.error("Error fetching quiz result:", error);
      }
    };

    fetchQuizResult();
  }, [quizData]);

  if (!result) {
    return <div className="text-center text-gray-600">Loading results...</div>;
  }

  return (
    <div className="bg-white p-8 shadow-2xl rounded-xl w-full text-center">
      <h2 className="text-3xl font-extrabold text-blue-600">
        Your Skin Type: {result.skinType}
      </h2>
      <p className="text-gray-700 mt-4 text-lg">
        Here are some recommended products for you:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {result.products.length > 0 ? (
          result.products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-blue-500 font-bold mt-2">{product.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      {/* Button to Build Routine */}
      {result.products.length > 0 && (
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() =>
            navigate("/routine-builder", {
              state: { products: result.products },
            })
          }
        >
          Build Your Routine
        </button>
      )}
    </div>
  );
};

export default QuizResult;
