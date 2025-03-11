import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNewsContext } from "../../../context/EvenContext";
import newsAPI from "../../../services/events";

const DashboardEvents = () => {
  const { news, setNews, fetchNews } = useNewsContext();
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    imageUrl: "",
    createDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    fetchNews();
  }, []);

  const totalPages = Math.max(1, Math.ceil(news.length / eventsPerPage));
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = news.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("API_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl })); // Lưu URL ảnh từ API
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.startDate || !form.endDate) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin sự kiện.", "error");
      return;
    }

    try {
      let response;
      const requestData = {
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        createDate: form.createDate,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      if (form.id) {
        response = await newsAPI.editNews(form.id, requestData);
        Swal.fire("Thành công!", "Sự kiện đã được cập nhật.", "success");
      } else {
        response = await newsAPI.createNews(requestData);
        Swal.fire("Thành công!", "Sự kiện mới đã được thêm.", "success");
      }

      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      if (error.response) {
        Swal.fire(
          "Lỗi!",
          `Không thể lưu sự kiện: ${error.response.data.message}`,
          "error"
        );
      } else if (error.request) {
        Swal.fire("Lỗi!", "Không nhận được phản hồi từ máy chủ.", "error");
      } else {
        Swal.fire("Lỗi!", `Đã xảy ra lỗi: ${error.message}`, "error");
      }
    }
  };

  const handleEditEvents = async (eventId) => {
    try {
      const response = await newsAPI.getNewsById(eventId);
      const eventToEdit = response.data;

      if (!eventToEdit) {
        throw new Error("Event not found");
      }

      setForm({
        id: eventToEdit.id,
        title: eventToEdit.title,
        content: eventToEdit.content,
        imageUrl: eventToEdit.imageUrl,
        createDate: eventToEdit.createDate.split("T")[0],
        startDate: eventToEdit.startDate.split("T")[0],
        endDate: eventToEdit.endDate.split("T")[0],
      });
    } catch (error) {
      console.error("Lỗi khi tải sự kiện:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải thông tin sự kiện, vui lòng thử lại.",
      });
    }
  };

  const handleDelete = async (eventId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await newsAPI.deleteNewsById(eventId);
          fetchNews();
          Swal.fire("Đã xóa!", "Sự kiện đã được xóa thành công.", "success");
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      content: "",
      imageUrl: "",
      createDate: new Date().toISOString().split("T")[0],
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="p-8 bg-white shadow-xl rounded-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-gray-800 flex items-center">
          <span className="text-4xl mr-2">🎉</span> Quản lý sự kiện
        </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
      </div>

      {/* Form section */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {form.id ? "Cập nhật sự kiện" : "Thêm sự kiện mới"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Tiêu đề sự kiện
            </label>
            <input
              type="text"
              placeholder="✏️ Nhập tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nội dung sự kiện
            </label>
            <input
              type="text"
              placeholder="📄 Nhập nội dung"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Ngày tạo
            </label>
            <input
              type="date"
              value={form.createDate}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Hình ảnh sự kiện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {form.imageUrl && (
          <div className="mt-6 flex flex-col items-center">
            <p className="mb-2 text-gray-700 font-medium">Ảnh xem trước:</p>
            <div className="relative group">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow-lg border-2 border-blue-100"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 font-medium">
                  Xem trước
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <span className="mr-2">{form.id ? "🔄" : "➕"}</span>
            {form.id ? "Cập nhật sự kiện" : "Thêm sự kiện"}
          </button>

          {form.id && (
            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ❌ Hủy
            </button>
          )}
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Danh sách sự kiện
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                <th className="p-4 text-left font-semibold">📌 Tiêu đề</th>
                <th className="p-4 text-left font-semibold">📖 Nội dung</th>
                <th className="p-4 text-center font-semibold">📅 Ngày tạo</th>
                <th className="p-4 text-center font-semibold">🖼 Ảnh</th>
                <th className="p-4 text-center font-semibold">⚡ Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className={`border-b hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {event.title}
                    </td>
                    <td className="p-4 text-gray-600">{event.content}</td>
                    <td className="p-4 text-center text-gray-600">
                      {event.createDate}
                    </td>
                    <td className="p-4 flex justify-center">
                      <div className="relative group">
                        <img
                          src={event.imageUrl}
                          alt="Event"
                          className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
                      </div>
                    </td>
                    <td className="p-4 space-x-1 text-center">
                      <button
                        onClick={() => handleEditEvents(event.id)}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors duration-200 inline-flex items-center"
                      >
                        <span className="mr-1">✏️</span> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors duration-200 inline-flex items-center"
                      >
                        <span className="mr-1">❌</span> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Chưa có sự kiện nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                &laquo; Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Sau &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEvents;
