import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    if (!recaptchaToken) {
      Swal.fire("Lỗi!", "Vui lòng xác minh reCAPTCHA.", "error");
      return;
    }

    setLoading(true);

    try {
      await login({ ...formData, recaptchaToken });

      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: "Chào mừng bạn quay trở lại!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      Swal.fire(
        "Lỗi!",
        err.response?.data?.message ||
          "Đăng nhập không thành công. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-3/4 max-w-4xl">
          <div className="w-1/2 hidden md:block">
            <img
              src={loginImage}
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Đăng nhập
            </h3>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Google reCAPTCHA */}
              <ReCAPTCHA
                sitekey="6LdigtQqAAAAANHvagd73iYJm0B4n2mQjXvf9aX9"
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />

              {/* Nút đăng nhập */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#6bbcfe] hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 text-sm">
              <p className="text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
