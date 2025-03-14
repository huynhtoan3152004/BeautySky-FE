import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import GetCarePlanAPI from "../services/getcareplan";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";

const RoutineBuilderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [carePlan, setCarePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchCarePlan = async () => {
      if (!user) {
        setShowLoginPopup(true);
        setLoading(false);
        return;
      }

      const userId = user?.userId || location.state?.userId;
      console.log("UserId trong useEffect:", userId);

      if (!userId) {
        setError("Không tìm thấy userId. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      try {
        let response;
        const skinTypeId = location.state?.skinTypeId;
        const isNewPlan = location.state?.isNewPlan;

        if (isNewPlan && skinTypeId) {
          response = await GetCarePlanAPI.getCarePlanBySkinType(skinTypeId);
        } else {
          response = await GetCarePlanAPI.getUserCarePlan(userId);
        }
        setCarePlan(response.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy lộ trình:", err);
        setError("Không thể tải lộ trình. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarePlan();
  }, [user, location.state]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { from: location } });
  };

  const saveCarePlan = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    const userId = user?.userId;
    const carePlanId = carePlan?.carePlanId;
    const skinTypeId = carePlan?.skinTypeId;

    console.log("Thông tin trước khi lưu:", { userId, carePlanId, skinTypeId });

    if (!userId) {
      alert("Lỗi: userId không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }
    if (!carePlanId || !skinTypeId) {
      alert("Lỗi: Dữ liệu lộ trình không đầy đủ. Vui lòng thử lại.");
      return;
    }

    try {
      const response = await GetCarePlanAPI.saveUserCarePlan(
        userId,
        carePlanId,
        skinTypeId
      );
      if (response.status === 200) {
        alert("Lộ trình đã được lưu thành công!");
      } else {
        alert("Không thể lưu lộ trình. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Lỗi khi lưu lộ trình:", err);
      alert("Không thể lưu lộ trình. Vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600 animate-pulse">
              Đang tải lộ trình...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (showLoginPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96 text-center">
          <h2 className="text-xl font-bold">Vui lòng đăng nhập</h2>
          <p className="mt-4">Bạn cần đăng nhập để xem lộ trình chăm sóc da.</p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleLoginRedirect}
            >
              Đăng nhập
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={() => navigate("/quizz")}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!carePlan) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600">Không có lộ trình nào!</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-[#6BBCFE] animate-pulse mb-6">
              {carePlan.planName}
            </h2>
            <p className="text-xl text-gray-600">{carePlan.description}</p>
          </div>

          <div className="space-y-6">
            {carePlan.steps.map((step) => (
              <div
                key={step.stepOrder}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg"
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-4">
                    {step.stepOrder}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-blue-800 mb-2">
                      {step.stepName}
                    </h3>
                    <ul className="space-y-3">
                      {step.products.map((product) => (
                        <li
                          key={product.productId}
                          className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                          onClick={() => handleProductClick(product.productId)}
                        >
                          <img
                            src={product.productImage || "default-image-url.jpg"}
                            alt={product.productName}
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <span className="text-lg text-gray-800">
                              {product.productName}
                            </span>
                            <p className="text-md text-gray-600">
                              {formatCurrency(product.productPrice || product.price)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl hover:from-blue-500 hover:to-blue-700"
              onClick={() => navigate("/quizz")}
            >
              🔄 Làm lại bài kiểm tra
            </button>
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-8 rounded-xl hover:from-green-500 hover:to-green-700"
              onClick={() => navigate("/")}
            >
              🏠 Về trang chủ
            </button>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-8 rounded-xl hover:from-yellow-500 hover:to-yellow-700"
              onClick={saveCarePlan}
            >
              💾 Lưu lộ trình
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;