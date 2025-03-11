import React from "react";
import IMG from "../../assets/test/test0.png";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="min-h-[500px] flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300 py-12">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* Phần nội dung văn bản */}
          <div className="flex flex-col gap-6 sm:pt-0 px-6 sm:px-0">
            <h1
              data-aos="fade-up"
              className="text-4xl sm:text-5xl font-bold text-gray-900"
            >
              Bạn đang băn khoăn về loại da của mình?
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-lg text-gray-700 tracking-wide leading-7"
            >
              Hãy cùng tìm hiểu nhé! Làm bài kiểm tra vui nhộn của chúng tôi và
              khám phá loại da của bạn cùng{" "}
              <span className="font-bold">Sky Beauty</span>.
            </p>

            <div data-aos="fade-up" data-aos-delay="500">
              <Link
                to="/quizz"
                className="bg-gradient-to-r from-[#6BBCFE] to-[#2183d4] text-white py-3 px-6 rounded-full shadow-lg text-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                ✨ KIỂM TRA NGAY ✨
              </Link>
            </div>
          </div>

          {/* Phần hình ảnh */}
          <div data-aos="zoom-in">
            <img
              src={IMG}
              alt="Banner"
              className="max-w-lg w-full h-auto mx-auto rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
