import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Oops! Page not found.
      </h2>
      <p className="text-gray-600 mt-2">
        The page you're looking for doesn't exist.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default Error;
