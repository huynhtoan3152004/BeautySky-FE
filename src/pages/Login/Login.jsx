import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import loginImage from "../../assets/login/login.png";
import logo from "../../assets/logo.png";
import namebrand from "../../assets/namebrand.png";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import GoogleLogin from '../../components/Google/GoogleLogin';
import { useCart } from '../../context/CartContext';

function Login() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotifications();
  const { syncCartAfterLogin } = useCart();

  useEffect(() => {
    // Chỉ xử lý lỗi Google Login, bỏ phần đồng bộ giỏ hàng
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = 'Đăng nhập không thành công';
      switch (error) {
        case 'authentication-failed':
          errorMessage = 'Xác thực Google thất bại';
          break;
        case 'email-not-found':
          errorMessage = 'Không thể lấy email từ tài khoản Google';
          break;
        case 'server-error':
          errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau';
          break;
        default:
          break;
      }
      Swal.fire({
        icon: 'error',
        title: 'Lỗi đăng nhập Google',
        text: errorMessage,
        confirmButtonColor: '#6bbcfe'
      });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Thiếu thông tin',
        text: 'Vui lòng điền đầy đủ email và mật khẩu',
        confirmButtonColor: '#6bbcfe'
      });
      return false;
    }

    if (!recaptchaToken) {
      Swal.fire({
        icon: 'error',
        title: 'Chưa xác thực',
        text: 'Vui lòng xác minh reCAPTCHA',
        confirmButtonColor: '#6bbcfe'
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setLoading(true);
  
      // Hiển thị loading
      const loadingAlert = Swal.fire({
        title: 'Đang đăng nhập...',
        text: 'Vui lòng đợi trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      // Thử đăng nhập
      await login({ ...formData, recaptchaToken });
  
      // Đồng bộ giỏ hàng
      try {
        await syncCartAfterLogin();
      } catch (syncError) {
        console.error('Lỗi khi đồng bộ giỏ hàng:', syncError);
      }
  
      // Đóng loading
      loadingAlert.close();
  
      // Thông báo thành công
      await Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        text: 'Chào mừng bạn quay trở lại!',
        timer: 1500,
        showConfirmButton: false
      });
  
      addNotification("Bạn đã đăng nhập thành công! 🎉");
  
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';

      if (error.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không chính xác';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy tài khoản với email này';
      } else if (error.response?.status === 403) {
        errorMessage = 'Tài khoản của bạn đã bị khóa';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Hiển thị thông báo lỗi
      await Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: errorMessage,
        confirmButtonText: 'Thử lại',
        confirmButtonColor: '#6bbcfe',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Reload lại trang khi người dùng bấm "Thử lại"
          window.location.reload();
        }
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
              src={loginImage}
              alt="Login"
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
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10 lg:p-12">
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
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#6bbcfe] 
                             focus:ring-2 focus:ring-[#6bbcfe]/20 transition-all duration-200
                             text-gray-800 text-sm placeholder:text-gray-400"
                    placeholder="Nhập email của bạn"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#6bbcfe]
                             focus:ring-2 focus:ring-[#6bbcfe]/20 transition-all duration-200
                             text-gray-800 text-sm placeholder:text-gray-400"
                    placeholder="Nhập mật khẩu"
                    required
                    disabled={loading}
                  />
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center transform scale-90 sm:scale-100 -mx-2">
                  <ReCAPTCHA
                    sitekey="6LdigtQqAAAAANHvagd73iYJm0B4n2mQjXvf9aX9"
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                  />
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
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleLogin />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-[#6bbcfe] hover:text-blue-600 font-medium hover:underline transition-colors"
                  >
                    Đăng ký ngay
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

export default Login;
