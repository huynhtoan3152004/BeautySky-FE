import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import emailjs from "@emailjs/browser";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_edmj94n",
        "template_k2jb624",
        formData,
        "e2x2f8jJ_FfGoarLU"
      )
      .then(
        () => {
          alert("Tin nhắn đã được gửi thành công!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Email gửi thất bại: ", error.text);
        }
      );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8">
        <h2 className="text-5xl font-extrabold mb-6 text-[#6bbcfe] animate-bounce drop-shadow-md">
          Liên hệ với chúng tôi
        </h2>
        <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-2xl w-full transition-transform duration-500 hover:scale-105 hover:shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
              required
            />
            <textarea
              name="message"
              placeholder="Tin nhắn của bạn"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:ring-4 focus:ring-[#6bbcfe] transition duration-200 shadow-md"
              rows="5"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6bbcfe] to-blue-500 text-white py-3 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 font-bold"
            >
              Gửi tin nhắn
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
          </p>
        </div>
        <div className="w-full max-w-2xl mt-8 overflow-hidden rounded-2xl shadow-2xl border-4 border-blue-500">
          <iframe
            className="w-full h-72 rounded-2xl"
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
