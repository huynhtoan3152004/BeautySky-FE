import React from "react";
import { Bar } from "react-chartjs-2";

const RevenueChart = ({ revenueGrowth }) => {
  const data = {
    labels: revenueGrowth.map((item) => item.month), // Lấy danh sách tháng
    datasets: [
      {
        label: "Revenue",
        data: revenueGrowth.map((item) => item.revenue), // Lấy doanh thu theo tháng
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Revenue Growth
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
