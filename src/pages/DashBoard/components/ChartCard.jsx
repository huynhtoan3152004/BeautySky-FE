import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg transition transform hover:scale-105">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
