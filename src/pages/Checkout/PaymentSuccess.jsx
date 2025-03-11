import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import orderAPI from "../../services/order"; // Import API xử lý đơn hàng
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const orderId = searchParams.get("orderId"); // Lấy orderId từ URL

  useEffect(() => {
    const completeOrder = async () => {
      if (!orderId) {
        setStatus("failed");
        Swal.fire({
          icon: "error",
          title: "Lỗi thanh toán!",
          text: "Không tìm thấy đơn hàng.",
        });
        return;
      }

      try {
        const response = await orderAPI.createOrderCompleted(orderId);

        if (response && response.status === "Complete") {
          setStatus("success");
          Swal.fire({
            icon: "success",
            title: "Thanh toán thành công!",
            text: "Đơn hàng của bạn đã được xác nhận.",
          });
        } else {
          setStatus("failed");
          Swal.fire({
            icon: "error",
            title: "Thanh toán thất bại!",
            text: "Có lỗi xảy ra. Vui lòng thử lại.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi hoàn tất đơn hàng:", error);
        setStatus("failed");
        Swal.fire({
          icon: "error",
          title: "Lỗi hệ thống!",
          text: "Không thể xử lý đơn hàng. Hãy thử lại sau.",
        });
      }
    };

    completeOrder();
  }, [orderId]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-auto"
        >
          {status === "success" ? (
            <>
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mt-2">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
              </p>
            </>
          ) : status === "failed" ? (
            <>
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mt-2">
                Có lỗi xảy ra trong quá trình thanh toán. Hãy thử lại.
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              Đang kiểm tra trạng thái thanh toán...
            </p>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate("/vieworder")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Xem đơn hàng
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

export default PaymentSuccess;
