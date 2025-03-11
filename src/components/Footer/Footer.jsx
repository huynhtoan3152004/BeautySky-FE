import React from "react";
import footerLogo from "../../assets/footer/logo.png";
import footerNamebrand from "../../assets/footer/namebrand.png";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div data-aos="fade-up" className="bg-white text-gray-700">
      <section className="max-w-[1500px] mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">
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
            <p className="mt-4 leading-6 max-w-[400px]">
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
                href="#"
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
          <div className="grid grid-cols-2 gap-6">
            {/* Thông tin công ty */}
            <div>
              <h1 className="text-xl font-semibold mb-3">
                🏢 Công ty TNHH Thương mại FPT
              </h1>
              <ul className="space-y-2">
                <li>
                  📍 Địa chỉ: Lô E2a-7, Đường D1, Khu Công Nghệ Cao, Thủ Đức,
                  TP.HCM
                </li>
                <li>📞 Số điện thoại: 0937748123</li>
                <li>☎️ Hotline: (028) 7300 5588</li>
                <li>
                  ✉️ Email:{" "}
                  <a
                    href="mailto:company.skybeauty@fpt.net.vn"
                    className="text-blue-500 hover:underline"
                  >
                    company.fbeauty@fpt.net.vn
                  </a>
                </li>
              </ul>
            </div>

            {/* Điều khoản dịch vụ */}
            <div>
              <h1 className="text-xl font-semibold mb-3">
                📜 Điều khoản dịch vụ
              </h1>
              <ul className="space-y-2">
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  🛒 Hướng dẫn mua hàng
                </li>
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  🚚 Vận chuyển
                </li>
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  💳 Phương thức thanh toán
                </li>
                <li className="cursor-pointer hover:text-blue-500 transition-colors">
                  🔒 Bảo mật dữ liệu
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="text-center py-6 mt-8 border-t border-gray-300">
          <p>
            © 2025 | <b>Sky Beauty</b>. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
