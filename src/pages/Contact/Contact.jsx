import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Đang gửi tin nhắn...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await emailjs.send(
        "service_edmj94n",
        "template_k2jb624",
        formData,
        "e2x2f8jJ_FfGoarLU"
      );

      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tin nhắn của bạn đã được gửi thành công.',
        showConfirmButton: false,
        timer: 1500,
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });

      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Email gửi thất bại: ", error.text);
      
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Không thể gửi tin nhắn của bạn. Vui lòng thử lại sau.',
        confirmButtonColor: '#6bbcfe',
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8 md:p-6 sm:p-4">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-extrabold mb-6 text-[#6bbcfe] animate-bounce drop-shadow-md text-center">
          Liên hệ với chúng tôi
        </h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Company Information Section */}
          <div className="bg-white shadow-2xl rounded-2xl p-10 md:p-6 sm:p-4 w-full md:w-1/3 transition-transform duration-500 hover:shadow-3xl">
            <h3 className="text-2xl font-bold text-[#6bbcfe] mb-6">Thông tin công ty</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaBuilding className="text-[#6bbcfe] text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Công ty TNHH Thương mại FPT</h4>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt className="text-[#6bbcfe] text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Địa chỉ</h4>
                  <p className="text-gray-600">Lô E2a-7, Đường D1, Khu Công Nghệ Cao, Thủ Đức, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaPhone className="text-[#6bbcfe] text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Số điện thoại</h4>
                  <p className="text-gray-600">0937748231</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaEnvelope className="text-[#6bbcfe] text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">huynhhuutoanwork@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white shadow-2xl rounded-2xl p-10 md:p-6 sm:p-4 w-full md:w-2/3 transition-transform duration-500 hover:shadow-3xl">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-4 sm:space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 md:p-3 sm:p-2 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 md:p-3 sm:p-2 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
                required
              />
              <textarea
                name="message"
                placeholder="Tin nhắn của bạn"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 md:p-3 sm:p-2 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
                rows="5"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6bbcfe] to-blue-500 text-white py-3 md:py-2.5 sm:py-2 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 font-bold text-lg md:text-base sm:text-sm"
              >
                Gửi tin nhắn
              </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4 md:text-xs sm:text-xs">
              Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
            </p>
          </div>
        </div>
        <div className="w-full max-w-6xl mt-8 md:mt-6 sm:mt-4 overflow-hidden rounded-2xl shadow-2xl border-4 border-blue-500">
          <iframe
            className="w-full h-72 md:h-60 sm:h-48 rounded-2xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11083.334579850713!2d106.79672781264084!3d10.845668801469992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527374c43baad%3A0xb8b244d75d12213e!2sFPT%20Software%20Tp.H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1sen!2s!4v1740212518211!5m2!1sen!2s"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
