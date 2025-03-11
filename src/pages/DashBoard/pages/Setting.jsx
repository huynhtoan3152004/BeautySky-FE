import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Điều chỉnh đường dẫn nếu cần

const Setting = () => {
  const { darkMode, setDarkMode, language, setLanguage } =
    useContext(ThemeContext);

  return (
    <div
      className={`p-6 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Dark Mode */}
      <div
        className={`p-6 rounded-lg shadow mb-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
          />
          <span>Dark Mode</span>
        </label>
      </div>

      {/* Language */}
      <div
        className={`p-6 rounded-lg shadow mb-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Language</h2>
        <select
          className={`p-2 border rounded-md ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-200 text-gray-900"
          }`}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>
  );
};

export default Setting;
