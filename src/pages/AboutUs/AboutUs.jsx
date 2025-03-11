import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-out",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen text-gray-900">
        {/* 🌟 Hero Section */}
        <section
          className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://imageskincare.vn/wp-content/uploads/2022/04/cac-san-pham-image-skincare.jpeg')",
          }}
        >
          {/* Overlay với hiệu ứng gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center text-white p-6"
          >
            <h1 className="text-5xl font-bold drop-shadow-lg">
              Chăm sóc làn da của bạn
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-lg mx-auto">
              Khám phá vẻ đẹp tự nhiên với các sản phẩm mỹ phẩm cao cấp của
              chúng tôi.
            </p>

            {/* Nút CTA với hiệu ứng động */}
            <Link
              to="/"
              className="mt-6 inline-block bg-[#6BBCFE] text-white px-6 py-3 rounded-full text-lg font-semibold
      hover:bg-blue-600 transition transform hover:scale-110 shadow-lg hover:shadow-blue-400/50"
            >
              Khám phá ngay
            </Link>
          </motion.div>
        </section>

        {/* ✨ About Section */}
        <section className="container mx-auto py-16 px-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            data-aos="fade-up"
          >
            {/* Ảnh với hiệu ứng viền mềm và bóng đổ */}
            <motion.img
              src="https://tiki.vn/blog/wp-content/uploads/2023/02/review-la-roche-posay-1.jpg"
              alt="Mỹ phẩm thiên nhiên"
              className="rounded-lg shadow-lg shadow-blue-400 hover:shadow-2xl transition duration-300 border-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Nội dung giới thiệu */}
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
                Về Chúng Tôi
              </h2>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Chúng tôi là thương hiệu mỹ phẩm hàng đầu, mang đến những sản
                phẩm chất lượng cao được chiết xuất từ thiên nhiên.
              </p>

              {/* Danh sách đặc điểm với hiệu ứng */}
              <ul className="mt-6 space-y-3">
                {[
                  "Thành phần 100% thiên nhiên",
                  "Không chứa hóa chất độc hại",
                  "Được các chuyên gia da liễu khuyên dùng",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <FaCheckCircle className="text-green-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 🎥 Video Section */}
        <section className="bg-blue-100 py-16 text-center">
          <h2 className="text-4xl font-bold">Hành Trình Của Chúng Tôi</h2>
          <p className="mt-4 text-lg text-gray-600">
            Xem video giới thiệu về thương hiệu mỹ phẩm của chúng tôi.
          </p>
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <iframe
              width="700"
              height="400"
              src="https://www.youtube.com/embed/MihWtTw3Lk4"
              title="Giới thiệu thương hiệu"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </motion.div>
        </section>

        {/* 🚀 CTA Section */}
        <section className="py-16 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-6">
            {/* Phần chữ */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left md:text-center max-w-lg"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-snug">
                🌿 Cùng Chúng Tôi <span className="text-[#419fed]">Bảo Vệ</span>{" "}
                Làn Da Của Bạn!
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Sử dụng các sản phẩm chăm sóc da từ thiên nhiên giúp da bạn luôn
                khỏe mạnh và rạng rỡ.
              </p>

              {/* Nút CTA */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block mt-6"
              >
                <Link
                  to="/product"
                  className="bg-gradient-to-r from-[#419fed] to-[#186aadeb] text-white py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
                >
                  Xem Sản Phẩm
                </Link>
              </motion.div>
            </motion.div>

            {/* Phần hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src="https://cdn.tgdd.vn//News/1448398//larocheposay(2)-845x500.jpg"
                alt="Bảo vệ làn da"
                className="w-[450px] md:w-[550px] rounded-lg shadow-lg transition-all duration-300"
              />
              {/* Hiệu ứng ánh sáng lướt qua ảnh */}
              <div className="absolute inset-0 bg-white opacity-10 rounded-lg transition-opacity duration-500 hover:opacity-20"></div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
