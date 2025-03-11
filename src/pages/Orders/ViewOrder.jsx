import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import orderAPI from "../../services/order"; // ✅ API lấy thông tin đơn hàng
import Swal from "sweetalert2";

const ViewOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId"); // ✅ Lấy orderId từ URL
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không tìm thấy mã đơn hàng.",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await orderAPI.getOrderDetails(orderId);
        if (response) {
          setOrderData(response);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi tải đơn hàng!",
            text: "Không tìm thấy thông tin đơn hàng.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi hệ thống!",
          text: "Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.",
        });
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full mx-auto mt-5 mb-5"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Thông tin đơn hàng
          </h1>
          <p className="text-center text-gray-600">
            Mã đơn hàng:{" "}
            <span className="font-semibold">{orderData.orderId}</span>
          </p>
          <p className="text-center text-gray-600">
            Mã vận chuyển:{" "}
            <span className="font-semibold">{orderData.trackingId}</span>
          </p>

          {/* Danh sách sản phẩm */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Sản phẩm đã mua:
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg space-y-4 mt-2">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-gray-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <span>
                    {formatCurrency((item.price * item.quantity).toFixed(2))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(orderData.totalAmount.toFixed(2))}</span>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <CreditCardIcon className="w-6 h-6 text-blue-500 mr-2" /> Thông
              tin thanh toán
            </h2>
            <p className="text-gray-600 mt-2">
              Số tài khoản:{" "}
              <span className="font-semibold">
                {orderData.paymentInfo.bankAccount}
              </span>
            </p>
            <p className="text-gray-600">
              Số tiền đã thanh toán:{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(orderData.paymentInfo.amountPaid.toFixed(2))}
              </span>
            </p>
            <p className="text-gray-600">
              Phương thức:{" "}
              <span className="font-semibold">
                {orderData.paymentInfo.paymentMethod}
              </span>
            </p>
          </div>

          {/* Trạng thái giao hàng */}
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <TruckIcon className="w-6 h-6 text-green-500 mr-2" /> Trạng thái
              giao hàng
            </h2>
            <p className="text-gray-600 mt-2 font-semibold">
              {orderData.shippingStatus}
            </p>
            <ul className="mt-3 space-y-2">
              {orderData.shippingSteps.map((step, index) => (
                <li
                  key={index}
                  className={`flex items-center text-gray-700 ${
                    index < orderData.currentStep ? "text-blue-500" : ""
                  }`}
                >
                  <MapPinIcon className="w-5 h-5 mr-2" /> {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Nút điều hướng */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/product")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate("/")}
              className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
            >
              Trang chủ
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ViewOrder;
