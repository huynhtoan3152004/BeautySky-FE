import React from "react";
import footerLogo from "../../assets/footer/logo.png";
import footerNamebrand from "../../assets/footer/namebrand.png";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaExchangeAlt,
  FaShoppingCart,
  FaCreditCard,
  FaBuilding,
  FaScroll,
  FaMapMarkerAlt,
  FaPhone,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-white text-gray-700">
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo & Mô tả */}
          <div className="flex flex-col items-center text-center">
            <a href="#/" className="flex flex-col items-center space-y-2">
              <img src={footerLogo} alt="Logo" className="w-20" />
              <img
                src={footerNamebrand}
                alt="Tên thương hiệu"
                className="w-40"
              />
            </a>
            <p className="mt-4 leading-6 max-w-[400px] px-4 sm:px-0">
              Nhà phân phối độc quyền của <b>Sky Beauty</b> tại Việt Nam là Công
              ty TNHH Thương mại FPT.
            </p>

            {/* Mạng xã hội */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="hover:text-[#6BBCFE] transition-transform transform hover:scale-110"
              >
                <FaInstagram className="text-3xl text-gray-600 hover:text-pink-500" />
              </a>
              <a
                href="https://www.facebook.com/le.hoanghai.90663894"
                className="hover:text-[#6BBCFE] transition-transform transform hover:scale-110"
              >
                <FaFacebook className="text-3xl text-gray-600 hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="hover:text-[#6BBCFE] transition-transform transform hover:scale-110"
              >
                <FaLinkedin className="text-3xl text-gray-600 hover:text-blue-800" />
              </a>
            </div>
          </div>

          {/* Liên kết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Thông tin công ty */}
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-semibold mb-3">
                <FaBuilding className="inline-block mr-2" /> Công ty TNHH Thương
                mại FPT
              </h1>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex gap-1">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" /> Địa chỉ: Lô
                  E2a-7, Đường D1, Khu Công Nghệ Cao, Thủ Đức, TP.HCM
                </li>
                <li className="flex gap-1">
                  <FaPhone className="mt-1 flex-shrink-0" /> Số điện thoại:
                  0937748231
                </li>
                <li className="flex gap-1">
                  <FaEnvelope className="mt-1 flex-shrink-0" /> Email:{" "}
                  huynhhuutoanwork@gmail.com
                </li>
              </ul>
            </div>

            {/* Điều khoản dịch vụ */}
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-semibold mb-3">
                <FaScroll className="inline-block mr-2" /> Điều khoản dịch vụ
              </h1>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  <Link
                    to="/shopping-guide"
                    className="flex gap-1 items-center"
                  >
                    <FaShoppingCart className="text-sm" /> Hướng dẫn mua hàng
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  <Link
                    to="/company-policy"
                    className="flex gap-1 items-center"
                  >
                    <FaExchangeAlt className="text-sm" /> Chính sách đổi trả
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="text-center py-4 sm:py-6 mt-6 sm:mt-8 border-t border-gray-300 text-sm sm:text-base">
          <p>
            © 2025 | <b>Sky Beauty</b>. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
