import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomerChart = ({ customerGrowth }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Customer Growth Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={customerGrowth}>
          {/* Grid đẹp hơn */}
          <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />

          {/* Trục X/Y */}
          <XAxis dataKey="month" tick={{ fill: "#4B5563" }} />
          <YAxis tick={{ fill: "#4B5563" }} />

          {/* Tooltip tùy chỉnh, hiển thị khi hover */}
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Đường Line có chấm tương tác */}
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#4CAF50"
            strokeWidth={3}
            dot={{ r: 6, stroke: "#4CAF50", strokeWidth: 2, fill: "#fff" }}
            activeDot={{
              r: 10,
              stroke: "#2E7D32",
              strokeWidth: 3,
              fill: "#66BB6A",
            }}
          />

          {/* Chú thích */}
          <Legend verticalAlign="top" align="right" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerChart;
