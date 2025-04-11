import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import promotionsAPI from "../../../services/promotions"; // Import API
import Swal from "sweetalert2";

const PAGE_SIZE = 6;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
    quantity: 0,
    isActive: true
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'upcoming', 'active', 'expired'

  // 🟢 Lấy danh sách khuyến mãi từ API khi component được render
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await promotionsAPI.getAll();
        if (response?.data) {
          setPromotions(
            response.data.map((promo) => ({
              id: promo.promotionId,
              name: promo.promotionName,
              discount: `${promo.discountPercentage}%`,
              startDate: new Date(promo.startDate).toISOString().split("T")[0],
              endDate: new Date(promo.endDate).toISOString().split("T")[0],
              isActive: promo.isActive,
              quantity: promo.quantity || 0
            }))
          );
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải danh sách khuyến mãi.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleEditClick = (promo) => {
    setForm({ ...promo, discount: promo.discount.replace("%", "") });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setForm({ id: null, name: "", discount: "", startDate: "", endDate: "", quantity: 0, isActive: true });
    setIsEditing(false);
    setShowModal(true);
  };

  // Cập nhật hàm lọc để xử lý chính xác hơn
  const filteredPromotions = promotions.filter((promo) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const currentTime = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);

    // Lọc theo trạng thái trước
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'upcoming':
          // Chưa bắt đầu: thời gian hiện tại < startDate
          if (!(currentTime < startDate)) return false;
          break;
        case 'active':
          // Đang diễn ra: startDate <= thời gian hiện tại <= endDate
          if (!(currentTime >= startDate && currentTime <= endDate)) return false;
          break;
        case 'expired':
          // Đã kết thúc: thời gian hiện tại > endDate
          if (!(currentTime > endDate)) return false;
          break;
        default:
          break;
      }
    }

    // Sau đó lọc theo từ khóa tìm kiếm
    if (!searchLower) return true;

    // Tìm kiếm theo tất cả các trường
    return (
      // Tìm kiếm theo từng chữ cái trong tên
      (promo.name && promo.name.toLowerCase().split('').some(char => char.includes(searchLower))) ||
      (promo.discount && promo.discount.replace('%', '').includes(searchLower)) ||
      (promo.startDate && promo.startDate.includes(searchLower)) ||
      (promo.endDate && promo.endDate.includes(searchLower)) ||
      (promo.id && promo.id.toString().includes(searchLower)) ||
      (promo.quantity && promo.quantity.toString().includes(searchLower)) ||
      (promo.isActive && (promo.isActive ? 'đang hoạt động' : 'đã kết thúc').includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Cập nhật hàm getPromotionStatus để đồng bộ với logic lọc
  const getPromotionStatus = (startDate, endDate) => {
    const currentTime = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentTime < start) {
      return { text: "Chưa bắt đầu", color: "bg-yellow-100 text-yellow-800" };
    } else if (currentTime > end) {
      return { text: "Đã kết thúc", color: "bg-red-100 text-red-800" };
    } else {
      return { text: "Đang diễn ra", color: "bg-green-100 text-green-800" };
    }
  };

  // Thêm hàm để đếm số lượng theo từng trạng thái
  const getStatusCounts = () => {
    const currentTime = new Date();
    return {
      total: promotions.length,
      upcoming: promotions.filter(p => currentTime < new Date(p.startDate)).length,
      active: promotions.filter(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        return currentTime >= start && currentTime <= end;
      }).length,
      expired: promotions.filter(p => currentTime > new Date(p.endDate)).length
    };
  };

  // Trong phần JSX, cập nhật hiển thị số lượng
  const statusCounts = getStatusCounts();

  // Thêm hoặc sửa khuyến mãi
  const handleAddOrEditPromotion = async () => {
    try {
      if (!form.name || !form.discount || !form.startDate || !form.endDate || form.quantity < 0) {
        Swal.fire({
          icon: "warning",
          title: "Lỗi!",
          text: "Vui lòng nhập đầy đủ thông tin và số lượng không được âm!",
        });
        return;
      }

      // Kiểm tra discount và quantity không được âm
      if (parseInt(form.discount) < 0) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Phần trăm giảm giá không được âm!",
        });
        return;
      }

      if (parseInt(form.quantity) < 0) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Số lượng không được âm!",
        });
        return;
      }

      // Chỉ kiểm tra ngày bắt đầu không được trước ngày hiện tại khi thêm mới
      if (!isEditing && new Date(form.startDate) < new Date().setHours(0, 0, 0, 0)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Ngày bắt đầu không thể trước ngày hiện tại!",
        });
        return;
      }

      // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
      if (new Date(form.endDate) <= new Date(form.startDate)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Ngày kết thúc phải sau ngày bắt đầu!",
        });
        return;
      }

      const payload = {
        promotionName: form.name,
        discountPercentage: parseInt(form.discount),
        startDate: form.startDate,
        endDate: form.endDate,
        quantity: parseInt(form.quantity),
        isActive: true
      };

      if (isEditing) {
        const response = await promotionsAPI.editPromotions(form.id, {
          ...payload,
          promotionId: form.id,
        });

        if (response.status === 200) {
          setPromotions((prev) =>
            prev.map((p) =>
              p.id === form.id
                ? {
                    ...p,
                    name: form.name,
                    discount: `${form.discount}%`,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    quantity: form.quantity,
                    isActive: true
                  }
                : p
            )
          );

          Swal.fire({
            icon: "success",
            title: "Cập nhật thành công!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        const response = await promotionsAPI.createPromotions(payload);

        if (response.status === 200) {
          const newPromo = {
            id: response.data.promotionId,
            name: form.name,
            discount: `${form.discount}%`,
            startDate: form.startDate,
            endDate: form.endDate,
            quantity: form.quantity,
            isActive: true
          };
          
          setPromotions((prev) => [...prev, newPromo]);

          Swal.fire({
            icon: "success",
            title: "Thêm thành công!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }

      setShowModal(false);
      setForm({
        id: null,
        name: "",
        discount: "",
        startDate: "",
        endDate: "",
        quantity: 0,
        isActive: true
      });
    } catch (error) {
      console.error("Lỗi:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.response?.data || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  // 🟢 Xóa khuyến mãi với xác nhận
  const handleDeletePromotion = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await promotionsAPI.deletePromotions(id);
        setPromotions(promotions.filter((p) => p.id !== id));

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Khuyến mãi đã bị xóa thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể xóa khuyến mãi, vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center">
        <span className="bg-blue-500 text-white p-2 rounded-md mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </span>
        Quản lý khuyến mãi
      </h2>

      {/* Search Input - cải thiện giao diện */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Thêm bộ lọc trạng thái */}
        <div className="relative w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="upcoming">Chưa bắt đầu</option>
            <option value="active">Đang diễn ra</option>
            <option value="expired">Đã kết thúc</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FaPlus className="mr-2" /> Thêm khuyến mãi
        </button>
      </div>

      {/* Thêm hiển thị số lượng khuyến mãi theo trạng thái */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">Tổng số: </span>
          <span className="font-semibold">{statusCounts.total}</span>
        </div>
        <div className="bg-yellow-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-yellow-600">Chưa bắt đầu: </span>
          <span className="font-semibold">{statusCounts.upcoming}</span>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-green-600">Đang diễn ra: </span>
          <span className="font-semibold">{statusCounts.active}</span>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-red-600">Đã kết thúc: </span>
          <span className="font-semibold">{statusCounts.expired}</span>
        </div>
      </div>

      {/* Loading State - cải thiện */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Đang tải danh sách khuyến mãi...</p>
        </div>
      ) : (
        <>
          {/* Responsive Table Container - cải thiện */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full bg-white border-collapse min-w-[320px] md:min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-left">Tên</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center">Giảm giá</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center">Số lượng</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center hidden sm:table-cell">Ngày bắt đầu</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center hidden sm:table-cell">Ngày hết hạn</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-sm md:text-base font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPromotions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Không tìm thấy khuyến mãi nào
                    </td>
                  </tr>
                ) : (
                  paginatedPromotions.map((promo, index) => (
                    <tr 
                      key={promo.id} 
                      className={`border-b hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-4 text-sm md:text-base">{promo.name}</td>
                      <td className="py-3 px-4 text-sm md:text-base text-center">
                        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                          {promo.discount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm md:text-base text-center">
                        {promo.quantity}
                      </td>
                      <td className="py-3 px-4 text-sm md:text-base text-center hidden sm:table-cell">
                        {promo.startDate}
                      </td>
                      <td className="py-3 px-4 text-sm md:text-base text-center hidden sm:table-cell">
                        {promo.endDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {(() => {
                          const status = getPromotionStatus(promo.startDate, promo.endDate);
                          return (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                              {status.text}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleEditClick(promo)}
                            className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                            title="Xóa"
                          >
                            <FaTrash size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Responsive Pagination - cải thiện */}
          {totalPages > 0 && (
            <div className="flex flex-wrap justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm flex items-center ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm flex items-center ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Tiếp
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Responsive Modal - cải thiện */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-2xl w-full max-w-[90%] md:max-w-md transform transition-all animate-fadeIn">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
              <span className="bg-blue-500 text-white p-1.5 rounded-md mr-2">
                {isEditing ? <FaEdit /> : <FaPlus />}
              </span>
              {isEditing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khuyến mãi</label>
                <input
                  type="text"
                  placeholder="Nhập tên khuyến mãi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                <input
                  type="number"
                  placeholder="Nhập % giảm giá"
                  value={form.discount}
                  onChange={(e) => setForm({...form, discount: e.target.value.replace(/\D/g, "")})}
                  className="w-full p-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  type="number"
                  placeholder="Nhập số lượng"
                  value={form.quantity}
                  onChange={(e) => setForm({...form, quantity: e.target.value.replace(/\D/g, "")})}
                  className="w-full p-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full p-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full p-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between gap-3 mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 w-1/2 text-sm md:text-base transition-colors shadow-md"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrEditPromotion}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 w-1/2 text-sm md:text-base transition-colors shadow-md"
              >
                {isEditing ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
