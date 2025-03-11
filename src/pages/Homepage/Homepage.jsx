import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "./Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import Products from "./Products";
import TopProducts from "./TopProducts";
import Banner from "./Banner";
import Footer from "../../components/Footer/Footer";
import Testimonials from "./Testimonials";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const SkincareQuizPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Hiệu ứng xuất hiện mượt mà */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[900px] h-[500px] relative text-center"
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✖
        </button>

        {/* Hình ảnh minh họa */}
        <img
          src="https://tiki.vn/blog/wp-content/uploads/2023/01/cac-buoc-skincare-1.png"
          alt="Skincare Quiz"
          className="w-[400px] mx-auto mb-4"
        />

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Khám phá loại da của bạn! 🌿
        </h2>
        <p className="text-gray-600 mb-5">
          Hãy trả lời một số câu hỏi để chúng tôi giúp bạn chọn sản phẩm phù hợp
          nhất.
        </p>

        {/* Link đến trang Quiz */}
        <Link
          to="/quizz"
          className="inline-block bg-gradient-to-r from-[#6BBCFE] to-blue-500 text-white px-5 py-3 rounded-lg shadow-lg text-lg hover:scale-105 transition-all duration-300"
        >
          Bắt đầu ngay 🚀
        </Link>
      </motion.div>
    </div>
  );
};

const Homepage = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu quiz chưa hiển thị lần nào trong session này
    const hasSeenQuiz = sessionStorage.getItem("hasSeenQuiz");
    if (!hasSeenQuiz) {
      setShowQuizPopup(true);
      sessionStorage.setItem("hasSeenQuiz", "true");
    }
  }, []);

  const closeQuizPopup = () => {
    setShowQuizPopup(false);
  };

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div>
      {showQuizPopup && <SkincareQuizPopup onClose={closeQuizPopup} />}
      <Navbar handleOrderPopup={handleOrderPopup} />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Products />
      <TopProducts />
      <Banner />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Homepage;
