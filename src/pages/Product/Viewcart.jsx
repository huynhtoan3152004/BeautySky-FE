import { useState, useEffect, useMemo } from "react";
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
import paymentAPI from "../../services/payment";

const Viewcart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [promotions, setPromotions] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  }));
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchMyPromotions = async () => {
      try {
        if (user) {
          const response = await promotionsAPI.getMyPromotions();
          if (response.status === 200) {
            const { userPoint, promotion } = response.data;
            setUserPoints(userPoint);
            setPromotions(promotion);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        if (error.response?.status === 404) {
          setPromotions([]);
          Swal.fire({
            icon: 'info',
            title: 'Không có khuyến mãi',
            html: `
              <div class="text-left">
                <p>Hiện tại không có khuyến mãi nào phù hợp. Có thể do:</p>
                <ul class="list-disc pl-4 mt-2 space-y-1">
                  <li>Bạn chưa đủ điểm để đổi khuyến mãi</li>
                  <li>Không có khuyến mãi đang hoạt động</li>
                  <li>Các khuyến mãi đã hết hạn</li>
                </ul>
              </div>
            `,
            confirmButtonText: 'Đồng ý'
          });
        } else if (error.response?.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi xác thực',
            text: 'Vui lòng đăng nhập lại để tiếp tục.',
            confirmButtonText: 'Đồng ý'
          });
        }
      }
    };

    fetchMyPromotions();
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.productId]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const discountedPrice = selectedVoucher
    ? selectedTotalPrice -
      (selectedTotalPrice * selectedVoucher.discountPercentage) / 100
    : selectedTotalPrice;

  const handleSelectAll = (checked) => {
    const newSelectedItems = {};
    if (checked) {
      cartItems.forEach((item) => {
        newSelectedItems[item.productId] = true;
      });
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const hasSelectedItems = Object.values(selectedItems).some((value) => value);

  const handleProceedToPayment = async () => {
    try {
      // Kiểm tra đăng nhập
      if (!user) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng đăng nhập",
          html: `
            <div class="text-left">
              <p class="mb-2">Bạn cần đăng nhập để thực hiện thanh toán.</p>
              <p class="text-sm text-gray-600">Sau khi đăng nhập, bạn có thể tiếp tục mua hàng.</p>
            </div>
          `,
          confirmButtonText: "Đăng nhập ngay",
          showCancelButton: true,
          cancelButtonText: "Để sau"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }

      const selectedProducts = cartItems.filter(
        (item) => selectedItems[item.productId]
      );

      if (selectedProducts.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Chưa chọn sản phẩm!",
          text: "Vui lòng chọn ít nhất một sản phẩm để thanh toán.",
        });
        return;
      }

      Swal.fire({
        title: "Đang xử lý...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const orderProducts = selectedProducts.map((item) => ({
        productID: Number(item.productId),
        quantity: Number(item.quantity),
      }));

      const promotionId = selectedVoucher
        ? Number(selectedVoucher.promotionId)
        : null;
      const orderResponse = await orderAPI.createOrder(
        promotionId,
        orderProducts
      );

      if (orderResponse.orderId) {
        if (paymentMethod === "VNPay") {
          const paymentRequest = {
            orderId: orderResponse.orderId,
            amount: discountedPrice,
            orderInfo: `Thanh toan don hang #${orderResponse.orderId}`,
            orderType: "other",
            language: "vn",
            name: formData.name,
            orderDescription: `Don hang ${orderResponse.orderId}`,
          };

          const vnpayResponse = await paymentAPI.createVNPayPayment(
            paymentRequest
          );

          if (vnpayResponse.paymentUrl) {
            localStorage.setItem(
              "pendingOrder",
              JSON.stringify({
                orderId: orderResponse.orderId,
                amount: discountedPrice,
                products: selectedProducts,
              })
            );

            window.location.href = vnpayResponse.paymentUrl;
          } else {
            throw new Error("Không thể tạo URL thanh toán");
          }
        } else {
          await Promise.all(
            selectedProducts.map((item) => removeFromCart(item.productId))
          );

          const orderInfo = {
            orderId: orderResponse.orderId,
            totalAmount: orderResponse.totalAmount,
            discountAmount: orderResponse.discountAmount,
            finalAmount: orderResponse.finalAmount,
            products: selectedProducts,
            paymentMethod: "Cash",
          };

          navigate("/ordersuccess", {
            state: {
              orderDetails: orderInfo,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      Swal.fire({
        icon: "error",
        title: "Không thể tạo đơn hàng",
        html: `
          <div class="text-left">
            <p class="mb-2 text-red-600 font-medium">${error.message || "Đã có lỗi xảy ra khi đặt hàng."}</p>
            <p class="text-sm text-gray-600 mt-2">Vui lòng kiểm tra lại thông tin và thử lại sau.</p>
          </div>
        `,
        confirmButtonText: "Đồng ý"
      });
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await handleRemoveItem(productId);
        return;
      }
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Xóa tất cả?",
      text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa tất cả",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Đang xử lý...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const promises = cartItems.map(item => removeFromCart(item.productId));
        await Promise.all(promises);

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Giỏ hàng của bạn đã được xóa.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi xóa giỏ hàng.",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-sm">
          <FaShoppingCart className="mr-3 text-blue-500 drop-shadow-md text-3xl md:text-5xl" />
          Giỏ hàng của bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingCart className="mx-auto text-gray-300 text-6xl mb-4" />
            <p className="text-center text-gray-500 text-lg mb-4">
              Giỏ hàng của bạn đang trống.
            </p>
            <button
              onClick={() => navigate("/product")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 shadow-lg rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold">
                  Sản phẩm ({cartItems.length})
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={
                        cartItems.length > 0 &&
                        cartItems.every((item) => selectedItems[item.productId])
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Chọn tất cả
                    </span>
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <FaTrash size={14} />
                      <span>Xóa tất cả</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 hover:bg-gray-50 transition-colors rounded-lg p-2"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedItems[item.productId] || false}
                        onChange={() => handleSelectItem(item.productId)}
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg border shadow-sm"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="w-full sm:w-auto">
                          <h2 className="text-lg text-gray-800">
                            {item.productName}
                          </h2>
                          <p className="text-blue-600 font-medium">
                            {formatCurrency(item.price)}
                          </p>
                          <div className="flex items-center mt-3 space-x-2">
                            <button
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                );
                              }}
                            >
                              −
                            </button>
                            <span className="text-lg w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end mt-4 sm:mt-0">
                      <p className="font-semibold text-gray-700 mb-2">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.productId);
                        }}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => navigate("/product")}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">←</span> Tiếp tục mua sắm
                </button>
                <p className="text-lg font-medium">
                  Đã chọn: {Object.values(selectedItems).filter(Boolean).length}{" "}
                  sản phẩm
                  <span className="font-bold text-blue-600 ml-2">
                    {formatCurrency(selectedTotalPrice)}
                  </span>
                </p>
              </div>
            </div>

            {/* Thanh toán */}
            <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg border border-gray-100 lg:sticky lg:top-4 self-start">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tạm tính (
                    {Object.values(selectedItems).filter(Boolean).length} sản
                    phẩm):
                  </span>
                  <span className="font-medium">
                    {formatCurrency(selectedTotalPrice)}
                  </span>
                </div>

                {selectedVoucher && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Giảm giá ({selectedVoucher.discountPercentage}%):
                    </span>
                    <span>
                      -
                      {formatCurrency(
                        (selectedTotalPrice *
                          selectedVoucher.discountPercentage) /
                          100
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Tổng thanh toán:</span>
                  <span className="text-blue-600">
                    {formatCurrency(discountedPrice)}
                  </span>
                </div>
              </div>

              {/* Mã giảm giá */}
              {user && promotions.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                    <span>Mã giảm giá</span>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <i className="fas fa-star text-yellow-400"></i>
                      <span className="text-sm font-medium text-gray-700">
                        Điểm của bạn: <span className="text-blue-600 font-bold">{userPoints}</span>
                      </span>
                    </div>
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    onChange={(e) => {
                      const selectedPromo = promotions.find(
                        (v) => v.promotionId === parseInt(e.target.value)
                      );
                      
                      if (selectedPromo) {
                        setSelectedVoucher(selectedPromo);
                      } else {
                        setSelectedVoucher(null);
                      }
                    }}
                  >
                    <option value="">Chọn mã giảm giá</option>
                    {promotions.map((promo) => (
                      <option
                        key={promo.promotionId}
                        value={promo.promotionId}
                      >
                        {promo.promotionName} - Giảm {promo.discountPercentage}%
                        (Hết hạn: {new Date(promo.endDate).toLocaleDateString('vi-VN')})
                      </option>
                    ))}
                  </select>

                  {selectedVoucher && (
                    <div className="mt-3 space-y-2 bg-blue-50 p-3 rounded-lg">
                      <div className="text-green-600 text-sm font-medium flex justify-between">
                        <span>Giảm giá {selectedVoucher.discountPercentage}%:</span>
                        <span>-{formatCurrency((selectedTotalPrice * selectedVoucher.discountPercentage) / 100)}</span>
                      </div>
                      <div className="text-gray-500 text-xs flex justify-between">
                        <span>Điểm sẽ bị trừ:</span>
                        <span className="font-medium text-blue-600">{selectedVoucher.discountPercentage} điểm</span>
                      </div>
                      <div className="text-gray-500 text-xs flex justify-between">
                        <span>Điểm còn lại sau khi sử dụng:</span>
                        <span className="font-medium text-blue-600">{userPoints - selectedVoucher.discountPercentage} điểm</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phương thức thanh toán */}
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">
                  Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg transition-all duration-300
                      ${
                        paymentMethod === "VNPay"
                          ? "bg-blue-500 text-white shadow-md border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    onClick={() => setPaymentMethod("VNPay")}
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    <span>VNPay</span>
                  </button>
                  <button
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg transition-all duration-300
                      ${
                        paymentMethod === "Cash"
                          ? "bg-green-500 text-white shadow-md border-green-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                      }`}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    <BanknotesIcon className="h-5 w-5" />
                    <span>Tiền mặt</span>
                  </button>
                </div>
              </div>

              {/* Form thông tin người nhận */}
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">
                  Thông tin người nhận
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "name", label: "Họ và tên", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Số điện thoại", type: "tel" },
                    { name: "address", label: "Địa chỉ", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm text-gray-600 mb-1">
                        {field.label}
                      </label>
                      <input
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all bg-gray-50 disabled:opacity-80"
                        type={field.type}
                        name={field.name}
                        placeholder={field.label}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        disabled={user !== null}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProceedToPayment}
                  disabled={!hasSelectedItems}
                  className={`mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg w-full flex items-center justify-center text-lg font-medium transition duration-300 shadow-md hover:shadow-lg ${
                    !hasSelectedItems ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Hoàn tất đơn hàng <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Viewcart;