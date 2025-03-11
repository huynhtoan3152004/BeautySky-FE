import React from "react";
import { Line } from "react-chartjs-2";

const SalesChart = ({ salesData, leadData }) => {
  // Kết hợp dữ liệu đơn hàng & khách hàng tiềm năng theo tháng
  const labels = salesData.map((sale) => sale.month);
  const salesValues = salesData.map((sale) => sale.sales);
  const leadsValues = labels.map((month) => {
    const leadEntry = leadData.find((lead) => lead.month === month);
    return leadEntry ? leadEntry.leads : 0;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Sales",
        data: salesValues,
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#FF5733",
      },
      {
        label: "Leads",
        data: leadsValues,
        borderColor: "#82ca9d",
        backgroundColor: "rgba(130, 202, 157, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#82ca9d",
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
        Sales & Leads Overview
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
