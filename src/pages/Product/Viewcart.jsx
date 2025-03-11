import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import promotionsAPI from "../../services/promotions";
import orderAPI from "../../services/order";
import { FaArrowRight, FaShoppingCart, FaTrash } from "react-icons/fa";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "../../utils/formatCurrency";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";

const Viewcart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [promotions, setPromotions] = useState([]);

  const [formData, setFormData] = useState(() => {
    const savedGuestData = localStorage.getItem("guestInfo");
    return user
      ? {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        }
      : savedGuestData
      ? JSON.parse(savedGuestData)
      : { name: "", email: "", phone: "", address: "" };
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      const fetchPromotions = async () => {
        try {
          const response = await promotionsAPI.getAll();
          if (response.status === 200) {
            setPromotions(response.data); // Lưu danh sách khuyến mãi vào state
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        }
      };

      fetchPromotions();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (!user) {
        localStorage.setItem("guestInfo", JSON.stringify(newFormData));
      }
      return newFormData;
    });
  };

  const discountedPrice = selectedVoucher
    ? (
        totalPrice -
        (totalPrice * selectedVoucher.discountPercentage) / 100
      ).toFixed(2)
    : totalPrice.toFixed(2);

  const handleProceedToPayment = async () => {
    if (!formData.name || !formData.email) {
      Swal.fire({
        icon: "error",
        title: "Thiếu thông tin!",
        text: "Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Đang xử lý thanh toán...",
        text: "Vui lòng đợi trong giây lát.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Lấy danh sách đơn hàng và tìm đơn hàng "In Cart"
      const response = await orderAPI.getAll();
      const userCart = response.data.find(
        (order) => order.userId === user.userId && order.status === "In Cart"
      );

      if (!userCart) {
        Swal.fire({
          icon: "error",
          title: "Lỗi đơn hàng!",
          text: "Không tìm thấy đơn hàng hợp lệ.",
          confirmButtonColor: "#d33",
        });
        return;
      }

      // Cập nhật trạng thái đơn hàng thành "Pending"
      await orderAPI.createOrderCheckout(userCart.orderId);

      // Hiển thị thông báo thanh toán thành công
      Swal.fire({
        icon: "success",
        title: "Thanh toán thành công!",
        text: "Đơn hàng của bạn đã được xử lý.",
        confirmButtonColor: "#28a745",
      }).then(() => {
        navigate("/paymentsuccess");
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống!",
        text: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500 drop-shadow-lg shadow-purple-400">
          <FaShoppingCart className="mr-3 text-blue-500 drop-shadow-md text-5xl" />
          Giỏ hàng của bạn
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Giỏ hàng trống.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Danh sách sản phẩm */}
            <div className="md:col-span-2 bg-white p-6 shadow-lg rounded-lg">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 mb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-600">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-300 rounded-lg text-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                          className="px-3 py-1 bg-gray-300 rounded-lg text-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Thanh toán */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
              <p className="mb-2 text-lg">
                Tổng tiền:{" "}
                <span className="font-semibold">
                  {formatCurrency(totalPrice)}
                </span>
              </p>

              {/* Mã giảm giá */}
              {user && promotions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Chọn mã giảm giá
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) =>
                      setSelectedVoucher(
                        promotions.find(
                          (v) => v.promotionId === parseInt(e.target.value)
                        )
                      )
                    }
                  >
                    <option value="">Không sử dụng</option>
                    {promotions
                      .filter((promo) => promo.isActive) // Chỉ hiển thị mã giảm giá đang hoạt động
                      .map((promo) => (
                        <option
                          key={promo.promotionId}
                          value={promo.promotionId}
                        >
                          {promo.promotionName} - {promo.discountPercentage}%
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <p className="font-semibold text-lg mb-4">
                Sau giảm giá: {formatCurrency(discountedPrice)}
              </p>

              {/* Phương thức thanh toán */}
              <h2 className="text-lg font-bold mb-3">Phương thức thanh toán</h2>
              <div className="flex space-x-4">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300 
    ${
      paymentMethod === "VNPay"
        ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-300 scale-105"
        : "bg-gray-200 hover:bg-blue-100"
    }`}
                  onClick={() => setPaymentMethod("VNPay")}
                >
                  <CreditCardIcon
                    className="h-5 w-5 transition-transform duration-300 
    ${paymentMethod === 'VNPay' ? 'scale-110' : ''}"
                  />
                  <span>VNPay</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300 
    ${
      paymentMethod === "Cash"
        ? "bg-green-500 text-white shadow-lg ring-2 ring-green-300 scale-105"
        : "bg-gray-200 hover:bg-green-100"
    }`}
                  onClick={() => setPaymentMethod("Cash")}
                >
                  <BanknotesIcon
                    className={`h-5 w-5 transition-transform duration-300 
    ${paymentMethod === "Cash" ? "scale-110" : ""}`}
                  />
                  <span>Tiền mặt</span>
                </button>
              </div>

              {/* Form thông tin người nhận */}
              <h2 className="text-lg font-bold mt-4">Thông tin người nhận</h2>
              {["name", "email", "phone", "address"].map((field) => (
                <input
                  key={field}
                  className="w-full p-2 border rounded mt-2 bg-gray-100 disabled:opacity-70"
                  type="text"
                  name={field}
                  placeholder={
                    field === "name"
                      ? "Họ và tên"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formData[field]}
                  onChange={handleInputChange}
                  disabled={user !== null} // Nếu đã đăng nhập, không cho chỉnh sửa
                />
              ))}

              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}

              <button
                onClick={handleProceedToPayment}
                className="mt-4 bg-[#6bbcfe] hover:bg-[#4aa8f5] text-white px-6 py-3 rounded-lg w-full flex items-center justify-center text-lg transition duration-300"
              >
                Thanh toán <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Viewcart;
