import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";

const orders = [
  {
    orderId: "#ORD20240227",
    date: "27/02/2024",
    status: "Đang giao hàng",
    total: 250000,
    items: ["Kem dưỡng da", "Toner cấp ẩm"],
    payment: "VNPAY",
    trackingId: "VN123456789",
  },
  {
    orderId: "#ORD20240226",
    date: "26/02/2024",
    status: "Đã giao hàng",
    total: 500000,
    items: ["Sữa rửa mặt", "Serum vitamin C", "Mặt nạ ngủ"],
    payment: "Thẻ tín dụng",
    trackingId: "VN987654321",
  },
  {
    orderId: "#ORD20240225",
    date: "25/02/2024",
    status: "Đã hủy",
    total: 150000,
    items: ["Kem chống nắng"],
    payment: "Thẻ tín dụng",
    trackingId: "Không có",
  },
  {
    orderId: "#ORD20240220",
    date: "20/02/2024",
    status: "Đã giao hàng",
    total: 300000,
    items: ["Bộ dưỡng da mini", "Tẩy tế bào chết"],
    payment: "MoMo",
    trackingId: "VN456789123",
  },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.orderId === `#${orderId}`);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">
          Không tìm thấy đơn hàng
        </h1>
        <button
          onClick={() => navigate("/order-history")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Quay lại Lịch sử đơn hàng
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 py-10">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            📦 Chi tiết đơn hàng
          </h1>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Mã đơn hàng:</strong> {order.orderId}
            </p>
            <p className="text-lg">
              <strong>Ngày đặt:</strong> {order.date}
            </p>
            <p className="text-lg flex items-center">
              <strong>Trạng thái:</strong>&nbsp;
              {order.status === "Đã giao hàng" ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              ) : order.status === "Đang giao hàng" ? (
                <TruckIcon className="w-5 h-5 text-blue-500 mr-2" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              )}
              {order.status}
            </p>
            <p className="text-lg">
              <strong>Sản phẩm:</strong> {order.items.join(", ")}
            </p>
            <p className="text-lg">
              <strong>Thanh toán:</strong> {order.payment}
            </p>
            <p className="text-lg">
              <strong>Mã vận chuyển:</strong> {order.trackingId}
            </p>
            <p className="text-lg font-semibold">
              <strong>Tổng tiền:</strong> {formatCurrency(order.total)}
            </p>
          </div>
          <button
            onClick={() => navigate("/order-history")}
            className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Quay lại Lịch sử đơn hàng
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
