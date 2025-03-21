import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaShoppingBag,
  FaEye,
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useOrdersContext } from "../../../context/OrdersContext";
import { useUsersContext } from "../../../context/UserContext";
import orderAPI from "../../../services/order";
import Swal from "sweetalert2";
import paymentsAPI from "../../../services/payment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// Chuẩn hóa ORDER_STATUS thành chữ thường
const ORDER_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_MAP = {
  [ORDER_STATUS.PENDING]: "Chờ xử lý",
  [ORDER_STATUS.COMPLETED]: "Đã hoàn thành",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
};

const Order = () => {
  const { orders = [], setOrders } = useOrdersContext();
  const { users = [], fetchUsers } = useUsersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const ordersPerPage = 5;
  const navigate = useNavigate();

  // Hàm lấy dữ liệu đơn hàng từ API
  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      const ordersData = await orderAPI.getAll();
      console.log("Raw orders data:", ordersData); // Để debug

      if (ordersData && ordersData.length > 0) {
        const processedOrders = ordersData.map((order) => {
          const userData = order.user || {};
          console.log("Processing order:", order); // Để debug từng order

          return {
            ...order,
            status: order.status || ORDER_STATUS.PENDING,
            userFullName: userData.fullName || "Không xác định",
            userPhone: userData.phone || "Không có",
            userAddress: userData.address || "Không có",
            userId: userData.userId || null,
            finalAmount: order.finalAmount || 0,
            paymentStatus: order.paymentId ? "Confirmed" : "Pending",
            // Đảm bảo các trường này được lấy đúng từ response
            cancelledDate: order.cancelledDate || order.cancelDate,
            cancelledReason: order.cancelledReason || order.cancelReason || "Không có lý do"
          };
        });
        console.log("Processed orders:", processedOrders); // Để debug
        setOrders(processedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi tải dữ liệu đơn hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm duyệt một đơn hàng
  const handleApproveOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận duyệt đơn",
        text: `Bạn có chắc muốn duyệt đơn hàng #${orderId}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Duyệt",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Đang xử lý...",
          text: "Vui lòng chờ trong giây lát",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        try {
          // Gọi API để xử lý thanh toán và xác nhận đơn hàng
          const response = await paymentsAPI.processAndConfirmPayment(orderId);
          // Cập nhật state ngay lập tức - đã sửa cách truy cập dữ liệu
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? {
                    ...order,
                    status: ORDER_STATUS.COMPLETED,
                    paymentStatus: "Confirmed",
                    // Kiểm tra nhiều cấu trúc phản hồi có thể có
                    paymentId: response.paymentId || (response.data && response.data.paymentId) || 0,
                  }
                : order
            )
          );

          // Tải lại dữ liệu từ server
          await fetchOrdersData();

          await Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã duyệt và thanh toán đơn hàng thành công",
            timer: 1500,
          });
        } catch (apiError) {
          console.error("Lỗi API khi duyệt đơn:", apiError);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: apiError.response?.data || apiError.message || "Có lỗi xảy ra khi duyệt đơn hàng",
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi duyệt đơn:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || error.message || "Có lỗi xảy ra khi duyệt đơn hàng",
      });
    }
  };

  // Hàm duyệt tất cả đơn hàng "Chờ xử lý"
  const handleApproveAllOrders = async () => {
    const pendingOrders = orders.filter(
      (order) => order.status === ORDER_STATUS.PENDING && !order.paymentId
    );

    if (pendingOrders.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Không có đơn hàng nào cần duyệt.",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Xác nhận duyệt tất cả",
        text: `Bạn có chắc muốn duyệt ${pendingOrders.length} đơn hàng đang chờ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Duyệt tất cả",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Đang xử lý...",
        html: `Đang duyệt ${pendingOrders.length} đơn hàng...<br>Vui lòng chờ trong giây lát`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const results = await Promise.allSettled(
        pendingOrders.map(async (order) => {
          try {
            const response = await paymentsAPI.processAndConfirmPayment(
              order.orderId
            );
            
            return {
              orderId: order.orderId,
              success: true,
              // Kiểm tra nhiều cấu trúc dữ liệu có thể có
              data: response.data || response
            };
          } catch (error) {
            console.error(`Lỗi khi xử lý đơn hàng ${order.orderId}:`, error);
            return {
              orderId: order.orderId,
              success: false,
              error: error.response?.data || error.message,
            };
          }
        })
      );

      const successful = results.filter((r) => r.status === "fulfilled" && r.value?.success).length;
      const failed = pendingOrders.length - successful;

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const resultItem = results.find(
            (r) => r.status === "fulfilled" && r.value?.orderId === order.orderId && r.value?.success
          );
          
          if (resultItem) {
            const resultData = resultItem.value.data;
            return {
              ...order,
              status: ORDER_STATUS.COMPLETED,
              paymentStatus: "Confirmed",
              // Xử lý nhiều cấu trúc dữ liệu có thể có
              paymentId: resultData.paymentId || (resultData.data && resultData.data.paymentId) || 0,
              paymentDate: resultData.paymentDate || (resultData.data && resultData.data.paymentDate) || new Date().toISOString(),
            };
          }
          return order;
        })
      );

      await fetchOrdersData();

      await Swal.fire({
        icon: successful > 0 ? "success" : "warning",
        title: "Kết quả xử lý",
        html: `
          <div class="text-left">
            <p>✅ Thành công: ${successful} đơn hàng</p>
            ${failed > 0 ? `<p>❌ Thất bại: ${failed} đơn hàng</p>` : ""}
          </div>
        `,
      });
    } catch (error) {
      console.error("Lỗi khi duyệt tất cả đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi duyệt đơn hàng. Vui lòng thử lại.",
      });
    }
  };

  // Lọc và phân trang đơn hàng
  const filteredOrders = orders
    .sort((a, b) => {
      const dateA = a.orderDate ? dayjs(a.orderDate).valueOf() : 0;
      const dateB = b.orderDate ? dayjs(b.orderDate).valueOf() : 0;
      return dateB - dateA; // Sắp xếp từ mới nhất đến cũ nhất
    })
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = [
        order.orderId,
        order.userFullName,
        order.userPhone,
        order.userAddress,
        order.finalAmount,
        order.status,
      ].some((field) => String(field).toLowerCase().includes(searchLower));

      // Sửa lại logic lọc theo status
      const matchesStatus =
        filterStatus === "All" || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Hàm hiển thị trạng thái và màu sắc
  const getStatusDisplay = (status) => {
    return STATUS_MAP[status] || "Chờ xử lý";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ORDER_STATUS.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case ORDER_STATUS.COMPLETED:
        return "bg-green-100 text-green-800";
      case ORDER_STATUS.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchOrdersData();
    fetchUsers();
  }, []);

  // Giao diện khi đang tải
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Giao diện khi không có đơn hàng
  if (!orders || orders.length === 0) {
    return (
      <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaShoppingBag className="text-3xl text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý đơn hàng
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có đơn hàng nào
          </h2>
          <p className="text-gray-500">
            Hiện tại chưa có đơn hàng nào trong hệ thống
          </p>
          <button
            onClick={fetchOrdersData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tải lại dữ liệu
          </button>
        </div>
      </div>
    );
  }

  // Giao diện chính
  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaShoppingBag className="text-3xl text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý đơn hàng
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          Tổng số đơn hàng: {orders.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        {/* Search và Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Completed">Đã hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>

            <button
              onClick={handleApproveAllOrders}
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle />
              Duyệt tất cả
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lý do hủy
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">#{order.orderId}</td>
                  <td className="p-4 text-sm">{order.userFullName}</td>
                  <td className="p-4 text-sm">{order.userPhone}</td>
                  <td className="p-4 text-sm">{order.userAddress}</td>
                  <td className="p-4 text-sm font-medium">
                    {formatCurrency(order.finalAmount)}
                  </td>
                  <td className="p-4 text-sm">
                    {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {order.status === "Cancelled" && (
                      <div className="flex flex-col gap-1">
                        <span className="text-red-600">
                          {order.cancelledReason || order.cancelReason || "Không có lý do"}
                        </span>
                        {(order.cancelledDate || order.cancelDate) && (
                          <span className="text-xs text-gray-500">
                            Hủy lúc: {dayjs(order.cancelledDate || order.cancelDate).format("DD/MM/YYYY HH:mm")}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus === "Confirmed"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {order.status === ORDER_STATUS.PENDING &&
                        !order.paymentId && (
                          <button
                            onClick={() => handleApproveOrder(order.orderId)}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform transform hover:-translate-y-1 hover:shadow-lg flex items-center gap-1"
                            title="Duyệt đơn"
                            style={{
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <FaCheckCircle className="w-4 h-4" />
                            <span className="text-sm">Duyệt</span>
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              {/* Nút Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                &lt;
              </button>

              {/* Các nút số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Hiển thị trang đầu, trang cuối, trang hiện tại và các trang xung quanh
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  // Hiển thị dấu ... nếu có khoảng cách
                  if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-3 py-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}

              {/* Nút Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
