import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerImage from "../../assets/register/register.png";
import logo from "../../assets/logo.png";
import namebrand from "../../assets/namebrand.png";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNotifications } from "../../context/NotificationContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate mật khẩu realtime
    if (name === "password") {
      if (value.length < 6) {
        setErrors(prev => ({
          ...prev,
          password: "Mật khẩu phải có ít nhất 6 ký tự"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: ""
        }));
      }
      
      // Kiểm tra khớp mật khẩu nếu confirmPassword đã được nhập
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: "Mật khẩu không khớp"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            confirmPassword: ""
          }));
        }
      }
    }

    // Validate confirmPassword realtime
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Mật khẩu không khớp"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { fullName, userName, email, phone, address, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!userName.trim()) {
      newErrors.userName = "Vui lòng nhập tên đăng nhập";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng kiểm tra lại thông tin đăng ký.',
        confirmButtonColor: '#6bbcfe',
      });
      return;
    }

    // Kiểm tra mật khẩu một lần nữa trước khi submit
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Mật khẩu không khớp. Vui lòng kiểm tra lại.',
        confirmButtonColor: '#6bbcfe',
      });
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      Swal.fire({
        title: "Đăng ký thành công!",
        text: "Bạn có thể đăng nhập ngay bây giờ.",
        icon: "success",
        confirmButtonColor: "#6bbcfe",
      }).then(() => navigate("/login"));
      addNotification("Bạn đã đăng ký tài khoản thành công! 🎉");
    } catch (err) {
      // Xử lý các loại lỗi từ backend
      let errorMessage = "Đăng ký thất bại!";
      
      if (err.response && err.response.data) {
        // Nếu backend trả về chuỗi lỗi trực tiếp
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } 
        // Nếu backend trả về object có message
        else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        // Nếu backend trả về lỗi validation dạng object
        else if (typeof err.response.data === 'object') {
          // Lấy lỗi đầu tiên từ object
          const firstError = Object.values(err.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Lỗi đăng ký',
        text: errorMessage,
        confirmButtonColor: '#6bbcfe',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
          {/* Left Side - Image */}
          <div className="md:w-1/2 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6bbcfe]/80 to-blue-400/80 z-10" />
            <img
              src={registerImage}
              alt="Register"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Kính chào quý khách</h2>
              <p className="text-center text-sm opacity-90">
                BeautySky hân hạnh được phục vụ quý khách với các sản phẩm chăm sóc da chất lượng cao, 
                giúp quý khách tự tin tỏa sáng mỗi ngày
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10 lg:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
              <Link to="/" className="mb-8">
                <div className="flex flex-row items-center justify-center">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-20 h-20 mb-4 hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
                  />
                  <img 
                    src={namebrand} 
                    alt="Namebrand" 
                    className="w-32 h-16 hover:scale-105 transition-transform duration-300 drop-shadow-md" 
                  />
                </div>
              </Link>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                             transition-all duration-200 text-gray-800 text-sm"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                             transition-all duration-200 text-gray-800 text-sm"
                    placeholder="Chọn tên đăng nhập"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                             transition-all duration-200 text-gray-800 text-sm"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                             transition-all duration-200 text-gray-800 text-sm"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                             transition-all duration-200 text-gray-800 text-sm"
                    placeholder="Nhập địa chỉ của bạn"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                    transition-all duration-200 text-gray-800 text-sm`}
                    placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#6bbcfe] focus:ring-2 focus:ring-[#6bbcfe]/20 
                    transition-all duration-200 text-gray-800 text-sm`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-300
                            transform hover:scale-[1.02] active:scale-[0.98] ${
                              loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#6bbcfe] to-[#0272cd] text-white shadow-lg hover:shadow-xl"
                            }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang đăng ký...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-[#6bbcfe] hover:text-blue-600 font-medium hover:underline transition-colors"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
