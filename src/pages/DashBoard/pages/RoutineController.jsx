import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import CarePlansAPI from "../../../services/careplansteps";
import Swal from "sweetalert2"; // Import SweetAlert2

const RoutineController = () => {
  const [steps, setSteps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    stepId: "",
    carePlanId: 1,
    stepOrder: "",
    stepName: "",
    stepDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define skin type mapping
  const skinTypes = {
    1: "Da Dầu",
    2: "Da Khô",
    3: "Da Thường",
    4: "Da Hỗn Hợp",
    5: "Da Nhạy Cảm"
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await CarePlansAPI.getAll();
      if (response.data) {
        setSteps(response.data);
      }
    } catch (err) {
      console.error("Error fetching steps:", err);
      setError("Không thể tải danh sách các bước. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật hàm lọc để tìm kiếm trên tất cả thông tin
  const filteredSteps = steps.filter((step) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả bước
    if (!searchLower) return true;
    
    // Tìm kiếm trên tất cả các trường thông tin
    return (
      // Tìm theo ID
      (step.stepId && step.stepId.toString().includes(searchLower)) ||
      // Tìm theo tên bước
      (step.stepName && step.stepName.toLowerCase().includes(searchLower)) ||
      // Tìm theo mô tả bước
      (step.stepDescription && step.stepDescription.toLowerCase().includes(searchLower)) ||
      // Tìm theo thứ tự bước
      (step.stepOrder && step.stepOrder.toString().includes(searchLower)) ||
      // Tìm theo loại da (bằng ID)
      (step.carePlanId && step.carePlanId.toString().includes(searchLower)) ||
      // Tìm theo tên loại da
      (skinTypes[step.carePlanId] && skinTypes[step.carePlanId].toLowerCase().includes(searchLower))
    );
  });

  const sortedFilteredSteps = [...filteredSteps].sort((a, b) => {
    // First sort by carePlanId
    if (a.carePlanId !== b.carePlanId) {
      return a.carePlanId - b.carePlanId;
    }
    // Then sort by stepOrder within the same carePlanId
    return a.stepOrder - b.stepOrder;
  });


  const checkDuplicateStep = (carePlanId, stepOrder, stepId = null) => {
    return steps.some(
      step => step.carePlanId === carePlanId && 
             step.stepOrder === stepOrder && 
             step.stepId !== stepId
    );
  };
  
  const checkStepLimit = (carePlanId) => {
    const stepsForSkinType = steps.filter(step => step.carePlanId === carePlanId);
    return stepsForSkinType.length >= 6;
  };

  const handleDelete = async (stepId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa bước này?",
      text: "Dữ liệu này sẽ không thể phục hồi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await CarePlansAPI.deleteCarePlanSteps(stepId);
        setSteps(steps.filter((step) => step.stepId !== stepId));
        Swal.fire("Đã xóa!", "Bước đã được xóa thành công.", "success");
      } catch (err) {
        console.error("Error deleting step:", err);
        Swal.fire("Lỗi!", "Không thể xóa bước. Vui lòng thử lại sau.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra giới hạn 6 bước (chỉ khi thêm mới)
    if (!formData.stepId && checkStepLimit(formData.carePlanId)) {
      Swal.fire({
        icon: 'error',
        title: 'Đã đạt giới hạn',
        text: 'Mỗi loại da chỉ được tối đa 6 bước chăm sóc.',
      });
      return;
    }
  
    // Kiểm tra trùng thứ tự bước
    if (checkDuplicateStep(formData.carePlanId, formData.stepOrder, formData.stepId || null)) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã tồn tại bước với thứ tự này trong loại da này. Vui lòng chọn thứ tự khác.',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
  
    try {
      if (formData.stepId) {
        // Update existing step
        const response = await CarePlansAPI.editCarePlanSteps(formData.stepId, formData);
        if (response.data) {
          setSteps(
            steps.map((step) =>
              step.stepId === formData.stepId ? { ...formData } : step
            )
          );
          Swal.fire("Cập Nhật Thành Công!", "Bước đã được cập nhật.", "success");
        }
      } else {
        // Add new step - remove stepId field
        const newStepData = { ...formData };
        delete newStepData.stepId; // Remove stepId for new records
        
        const response = await CarePlansAPI.createCarePlanSteps(newStepData);
        if (response.data) {
          setSteps([...steps, response.data]);
          Swal.fire("Thêm Mới Thành Công!", "Bước mới đã được thêm.", "success");
        }
      }
  
      setIsModalOpen(false);
      setFormData({ stepId: "", carePlanId: 1, stepOrder: "", stepName: "", stepDescription: "" });
    } catch (err) {
      // Error handling remains the same
      console.error("Error submitting form:", err);
      if (err.response && err.response.data) {
        console.error("Server error details:", err.response.data);
        setError(`Lỗi: ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Không thể lưu bước. Vui lòng thử lại sau.");
      }
      Swal.fire("Lỗi!", "Không thể lưu bước. Vui lòng thử lại sau.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleStepOrderChange = (e) => {
    const newOrder = e.target.value;
    setFormData({ ...formData, stepOrder: newOrder });
    
    if (newOrder && checkDuplicateStep(formData.carePlanId, newOrder, formData.stepId || null)) {
      setError('Thứ tự bước này đã tồn tại cho loại da này');
    } else {
      setError(null);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-6">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 tracking-wide">
          Quản Lý Các Bước Chăm Sóc Da
        </h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            disabled={isLoading}
          >
            <FiPlus /> Thêm Bước Mới
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        )}

        {/* Mobile View */}
        <div className="md:hidden">
          {sortedFilteredSteps.map((step, index) => (
            <div key={step.stepId} className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSkinTypeColor(step.carePlanId)}`}>
                    {skinTypes[step.carePlanId] || `Loại ${step.carePlanId}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(step);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(step.stepId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Thứ tự bước:</label>
                  <p className="font-medium">{step.stepOrder}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tên bước:</label>
                  <p className="font-medium">{step.stepName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Mô tả:</label>
                  <p className="text-sm text-gray-600">{step.stepDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-separate space-y-6">
            <thead>
              <tr className="bg-indigo-100 text-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Loại Da</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Thứ tự bước trong mỗi loại da</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên Bước</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mô Tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFilteredSteps.map((step, index) => (
                <tr key={step.stepId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSkinTypeColor(step.carePlanId)}`}>
                      {skinTypes[step.carePlanId] || `Loại ${step.carePlanId}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{step.stepOrder}</td>
                  <td className="px-6 py-4">{step.stepName}</td>
                  <td className="px-6 py-4">{step.stepDescription}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setFormData(step);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(step.stepId)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredSteps.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy bước nào</p>
          </div>
        )}
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 md:p-6 z-50">
    <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-900">
        {formData.stepId ? "Chỉnh Sửa" : "Thêm"} Bước
      </h2>
      
      {/* Thêm cảnh báo khi đủ 6 bước */}
      {!formData.stepId && checkStepLimit(formData.carePlanId) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Loại da này đã đạt tối đa 6 bước. Bạn không thể thêm mới nhưng vẫn có thể chỉnh sửa các bước hiện có.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại Da</label>
          <select
            required
            value={formData.carePlanId}
            onChange={(e) => setFormData({ ...formData, carePlanId: parseInt(e.target.value) })}
            className="w-full p-2 md:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={!!formData.stepId}
          >
            {Object.entries(skinTypes).map(([id, name]) => (
              <option 
                key={id} 
                value={id}
                disabled={checkStepLimit(parseInt(id)) && !formData.stepId}
              >
                {name} {checkStepLimit(parseInt(id)) && !formData.stepId ? '(Đã đủ 6 bước)' : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự bước</label>
          <input
            type="number"
            required
            min="1"
            max="6"
            value={formData.stepOrder}
            onChange={handleStepOrderChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {error && formData.stepOrder && checkDuplicateStep(formData.carePlanId, formData.stepOrder, formData.stepId || null) && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Giữ nguyên các trường khác */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên Bước</label>
          <input
            type="text"
            required
            value={formData.stepName}
            onChange={(e) => setFormData({ ...formData, stepName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
          <textarea
            required
            value={formData.stepDescription}
            onChange={(e) => setFormData({ ...formData, stepDescription: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="3"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:flex-1 bg-indigo-600 text-white py-2 md:py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all"
            disabled={isLoading || (!formData.stepId && checkStepLimit(formData.carePlanId))}
          >
            {isLoading ? "Đang xử lý..." : formData.stepId ? "Cập Nhật" : "Thêm Mới"}
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-full md:flex-1 bg-gray-200 text-gray-800 py-2 md:py-3 px-6 rounded-xl hover:bg-gray-300 transition-all"
            disabled={isLoading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

// Helper function to get appropriate background color for each skin type
const getSkinTypeColor = (carePlanId) => {
  switch (carePlanId) {
    case 1:
      return "bg-green-100 text-green-800"; // Da Dầu
    case 2:
      return "bg-blue-100 text-blue-800"; // Da Khô
    case 3:
      return "bg-yellow-100 text-yellow-800"; // Da Thường
    case 4:
      return "bg-purple-100 text-purple-800"; // Da Hỗn Hợp
    case 5:
      return "bg-red-100 text-red-800"; // Da Nhạy Cảm
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default RoutineController;
