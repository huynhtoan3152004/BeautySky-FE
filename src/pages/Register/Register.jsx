import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import registerImage from "../../assets/register/register.png";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const {
      fullName,
      userName,
      email,
      phone,
      address,
      password,
      confirmPassword,
    } = formData;

    if (
      !fullName ||
      !userName ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return "Vui lòng điền đầy đủ thông tin.";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email không hợp lệ.";
    }

    if (!/^\d{10,11}$/.test(phone)) {
      return "Số điện thoại không hợp lệ.";
    }

    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (password !== confirmPassword) {
      return "Mật khẩu và xác nhận mật khẩu không khớp.";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire("Lỗi", validationError, "error");
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
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.response?.data?.message || "Đăng ký thất bại!",
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
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
          <div className="hidden md:block w-1/2">
            <img
              src={registerImage}
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-10">
            <h3 className="text-3xl font-bold text-center text-[#6bbcfe] mb-6">
              Tạo tài khoản
            </h3>

            <form onSubmit={handleRegister} className="space-y-4">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  type={
                    field.includes("password")
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  placeholder={
                    field === "confirmPassword" ? "Xác nhận mật khẩu" : field
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#6bbcfe] hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="text-[#6bbcfe] hover:underline">
                  Đăng nhập
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

export default Register;
