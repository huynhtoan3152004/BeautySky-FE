import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import orderAPI from "../../services/order";
import paymentAPI from "../../services/payment";
import promotionsAPI from "../../services/promotions";

const ITEMS_PER_PAGE = 12;

const ProductList = ({ selectedSkinType, selectedCategory, sortOrder }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, fetchProduct, isLoading } = useDataContext();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [userPoints, setUserPoints] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [selectedSkinType, selectedCategory]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        point: user.point || 0,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchMyPromotions = async () => {
      try {
        if (user) {
          const response = await promotionsAPI.getMyPromotions();
          if (response.status === 200) {
            const { userPoint, promotion } = response.data;
            setUserPoints(userPoint);
            // Chỉ nhận các khuyến mãi đang hoạt động và trong thời hạn
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


  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product.isActive) return false;

        const productSkinType = product.skinTypeName?.toLowerCase() || "";
        const productCategory = product.categoryName?.toLowerCase() || "";

        const selectedSkinTypeLower = selectedSkinType.toLowerCase();
        const selectedCategoryLower = selectedCategory.toLowerCase();

        const skinTypeFilter =
          selectedSkinTypeLower === "tất cả" ||
          productSkinType.includes(selectedSkinTypeLower);

        const categoryFilter =
          selectedCategoryLower === "tất cả" ||
          productCategory.includes(selectedCategoryLower);

        return skinTypeFilter && categoryFilter;
      })
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [products, selectedSkinType, selectedCategory, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
      Swal.fire({
        icon: "error",
        title: "Hết hàng",
        text: "Sản phẩm này hiện đã hết hàng!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const cartItem = {
        productId: product.productId,
        quantity: 1,
        price: product.price,
        productName: product.productName,
        productImage: product.productsImages?.[0]?.imageUrl || product.image,
      };

      await addToCart(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || "Không thể thêm sản phẩm vào giỏ hàng",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleBuyNow = (product) => {
    if (product.quantity === 0) {
      Swal.fire({
        icon: "error",
        title: "Hết hàng",
        text: "Sản phẩm này hiện đã hết hàng!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    setSelectedProduct(product);
    setShowPaymentPopup(true);
  };

  const discountedPrice = selectedVoucher
    ? selectedProduct?.price - 
      (selectedProduct?.price * selectedVoucher.discountPercentage) / 100
    : selectedProduct?.price;

  const handlePayment = async () => {
    try {
      // Validate thông tin người dùng
      if (!user) {
        Swal.fire({
          icon: 'warning',
          title: 'Vui lòng đăng nhập',
          text: 'Bạn cần đăng nhập để thực hiện thanh toán',
          confirmButtonText: 'Đăng nhập ngay',
          showCancelButton: true,
          cancelButtonText: 'Để sau'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }

      if (!formData.name || !formData.phone || !formData.address) {
        Swal.fire({
          icon: 'error',
          title: 'Thiếu thông tin',
          html: `
            <div class="text-left">
              <p class="mb-2">Vui lòng cập nhật đầy đủ thông tin:</p>
              <ul class="list-disc pl-4">
                ${!formData.name ? '<li>Họ tên người nhận</li>' : ''}
                ${!formData.phone ? '<li>Số điện thoại</li>' : ''}
                ${!formData.address ? '<li>Địa chỉ giao hàng</li>' : ''}
              </ul>
            </div>
          `,
          confirmButtonText: 'Cập nhật thông tin'
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

      const orderProducts = [
        {
          productID: Number(selectedProduct.productId),
          quantity: 1,
        },
      ];

      const promotionId = selectedVoucher ? Number(selectedVoucher.promotionId) : null;
      
      try {
        const orderResponse = await orderAPI.createOrder(promotionId, orderProducts);

        if (orderResponse.orderId) {
          if (paymentMethod === "VNPay") {
            const paymentRequest = {
              orderId: orderResponse.orderId,
              amount: parseInt(discountedPrice),
              orderInfo: `Thanh toan don hang #${orderResponse.orderId}`,
              orderType: "other",
              language: "vn",
              name: formData.name,
              orderDescription: `Don hang ${orderResponse.orderId}`,
            };

            try {
              const vnpayResponse = await paymentAPI.createVNPayPayment(paymentRequest);

              if (vnpayResponse.paymentUrl) {
                localStorage.setItem(
                  "pendingOrder",
                  JSON.stringify({
                    orderId: orderResponse.orderId,
                    amount: parseInt(discountedPrice),
                    products: [
                      {
                        ...selectedProduct,
                        price: parseInt(selectedProduct.price),
                      },
                    ],
                  })
                );

                window.location.href = vnpayResponse.paymentUrl;
              } else {
                throw new Error("Không nhận được URL thanh toán từ VNPay");
              }
            } catch (vnpayError) {
              Swal.fire({
                icon: "error",
                title: "Lỗi thanh toán VNPay",
                html: `
                  <div class="text-left">
                    <p class="mb-2">Không thể kết nối với cổng thanh toán VNPay:</p>
                    <p class="text-sm text-gray-600">${vnpayError.message || 'Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác'}</p>
                  </div>
                `,
                confirmButtonText: "Đồng ý"
              });
            }
          } else {
            // Xử lý thanh toán tiền mặt
            Swal.close();

            await Swal.fire({
              icon: "success",
              title: "Đặt hàng thành công!",
              html: `
                <div class="text-left">
                  <p class="mb-2">Cảm ơn bạn đã đặt hàng. Thông tin đơn hàng:</p>
                  <ul class="list-none space-y-2">
                    <li><strong>Mã đơn hàng:</strong> #${orderResponse.orderId}</li>
                    <li><strong>Tổng tiền:</strong> ${formatCurrency(discountedPrice)}</li>
                    <li><strong>Phương thức:</strong> Thanh toán khi nhận hàng</li>
                  </ul>
                  <p class="mt-3 text-sm text-gray-600">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!</p>
                </div>
              `,
              confirmButtonText: "Đồng ý",
            });

            const productInfo = {
              productId: selectedProduct.productId,
              productName: selectedProduct.productName,
              quantity: 1,
              price: selectedProduct.price,
              productImage:
                selectedProduct.productsImages?.[0]?.imageUrl ||
                selectedProduct.image,
            };

            const orderInfo = {
              orderId: orderResponse.orderId,
              totalAmount: selectedProduct.price,
              discountAmount: selectedVoucher ? 
                (selectedProduct.price * selectedVoucher.discountPercentage) / 100 : 0,
              finalAmount: discountedPrice,
              products: [productInfo],
              paymentMethod: "Cash",
            };

            navigate("/ordersuccess", {
              state: {
                orderDetails: orderInfo,
              },
            });
          }
        }
      } catch (orderError) {
        Swal.fire({
          icon: "error",
          title: "Lỗi tạo đơn hàng",
          html: `
            <div class="text-left">
              <p class="mb-2">Không thể tạo đơn hàng:</p>
              <p class="text-sm text-gray-600">${orderError.message || 'Vui lòng thử lại sau'}</p>
              ${orderError.response?.data?.errors ? `
                <ul class="list-disc pl-4 mt-2 text-sm text-red-500">
                  ${orderError.response.data.errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `,
          confirmButtonText: "Đồng ý"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        html: `
          <div class="text-left">
            <p class="mb-2">Đã xảy ra lỗi không mong muốn:</p>
            <p class="text-sm text-gray-600">${error.message || 'Vui lòng thử lại sau'}</p>
          </div>
        `,
        confirmButtonText: "Đồng ý"
      });
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600">
              Không có sản phẩm nào phù hợp với bộ lọc của bạn.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white p-3 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-102 hover:shadow-xl flex flex-col group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
                    <img
                      src={
                        product.productsImages?.[0]?.imageUrl || product.image
                      }
                      alt={product.productName}
                      className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Hết hàng
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center flex-grow space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center line-clamp-2 hover:text-blue-600 cursor-pointer">
                      {product.productName}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex items-center">
                      {product.rating ? (
                        <>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => {
                              const ratingDiff = product.rating - index;
                              
                              return (
                                <div 
                              key={index}
                                  className="w-4 mr-0.5 flex items-center justify-center"
                                >
                                  {ratingDiff >= 1 ? (
                                    <i className="fas fa-star text-yellow-400"></i>
                                  ) : ratingDiff > 0 ? (
                                    <div className="relative w-full flex items-center justify-center">
                                      <i className="fas fa-star text-gray-300 absolute"></i>
                                      <i className="fas fa-star-half text-yellow-400 absolute"></i>
                                    </div>
                                  ) : (
                                    <i className="fas fa-star text-gray-300"></i>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="ml-1.5 text-sm text-gray-600">
                            ({product.rating.toFixed(1)})
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa có đánh giá
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    <button
                      className={`w-full py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold ${
                        product.quantity === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      {product.quantity === 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ hàng"}
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.quantity === 0}
                      className={`w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 ${
                        product.quantity === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <i className="fas fa-bolt mr-2"></i>
                      Mua ngay
                    </button>
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === index + 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>

                    {currentPage > 3 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber !== 1 &&
                        pageNumber !== totalPages &&
                        pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1
                      ) {
                        return (
                          <button
                            key={index}
                            className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {currentPage < totalPages - 2 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Popup Thanh toán nhỏ gọn */}
      {showPaymentPopup && selectedProduct && (
        <>
          {/* Overlay với animation fade */}
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              showPaymentPopup ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentPopup(false)}
            />

            {/* Panel thanh toán */}
            <div
              className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl transform transition-all duration-500 ease-out flex flex-col
                ${
                  showPaymentPopup
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              {/* Header với gradient animation */}
              <div className="relative h-16 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-[length:200%_100%] animate-gradient flex items-center justify-between px-6">
                <h3 className="text-white font-medium text-lg flex items-center gap-2">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="animate-fadeIn">Thanh toán nhanh</span>
                </h3>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:rotate-90 transform duration-300"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Content với scroll mượt */}
              <div className="flex-grow overflow-y-auto scroll-smooth pb-[140px]">
                <div className="p-6 space-y-6">
                  {/* Thông tin sản phẩm với animation */}
                  <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="w-1/3 overflow-hidden rounded-lg">
                        <img
                          src={
                            selectedProduct?.productsImages?.[0]?.imageUrl ||
                            selectedProduct?.image
                          }
                          alt={selectedProduct?.productName}
                          className="w-full h-24 object-cover transform transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      <div className="w-2/3">
                        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                          {selectedProduct?.productName}
                        </h3>
                        <div className="text-blue-600 font-bold animate-pulse">
                          {formatCurrency(selectedProduct?.price)}
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="text-sm text-gray-600">
                            {selectedProduct?.quantity > 0 ? (
                              <>
                                <span className="font-medium">Còn lại:</span>{" "}
                                <span className={`${
                                  selectedProduct?.quantity <= 10 
                                    ? "text-red-500 font-semibold" 
                                    : "text-green-600"
                                }`}>
                                  {selectedProduct?.quantity}
                                </span>{" "}
                                {selectedProduct?.quantity <= 10 && (
                                  <span className="text-xs text-red-500 animate-pulse">
                                    (Sắp hết hàng)
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-red-500 font-semibold">Hết hàng</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mã giảm giá */}
                  {promotions.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-tag text-blue-500"></i>
                          Mã giảm giá
                        </div>
                        {user && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <i className="fas fa-star text-yellow-400"></i>
                            <span className="text-sm font-medium text-gray-700">
                              Điểm của bạn: <span className="text-blue-600 font-bold">{userPoints}</span>
                            </span>
                          </div>
                        )}
                      </h4>

                      {!user ? (
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <i className="fas fa-exclamation-circle text-yellow-500 mr-2"></i>
                          <span className="text-sm text-yellow-700">
                            Vui lòng đăng nhập để sử dụng mã giảm giá
                          </span>
                        </div>
                      ) : (
                        <>
                          <select
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                            onChange={(e) => {
                              const selectedPromo = promotions.find(
                                (v) => v.promotionId === parseInt(e.target.value)
                              );
                              
                              if (selectedPromo) {
                                setSelectedVoucher(selectedPromo);
                                // Hiển thị thông tin chi tiết về voucher
                                Swal.fire({
                                  icon: 'info',
                                  title: 'Xác nhận sử dụng khuyến mãi',
                                  html: `
                                    <div class="text-left">
                                      <p class="mb-2">Bạn sẽ sử dụng ${selectedPromo.discountPercentage} điểm để được giảm ${selectedPromo.discountPercentage}%</p>
                                      <ul class="list-disc pl-4 space-y-1 text-sm">
                                        <li>Điểm hiện tại: <span class="font-semibold text-blue-600">${userPoints} điểm</span></li>
                                        <li>Điểm sau khi sử dụng: <span class="font-semibold text-green-600">${userPoints - selectedPromo.discountPercentage} điểm</span></li>
                                      </ul>
                                      <p class="mt-2 text-sm text-gray-600">
                                        Khuyến mãi có hiệu lực đến: ${new Date(selectedPromo.endDate).toLocaleDateString('vi-VN')}
                                      </p>
                                    </div>
                                  `,
                                  showCancelButton: true,
                                  confirmButtonText: 'Xác nhận',
                                  cancelButtonText: 'Hủy'
                                }).then((result) => {
                                  if (!result.isConfirmed) {
                                    setSelectedVoucher(null);
                                    e.target.value = "";
                                  }
                                });
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
                                <span>-{formatCurrency((selectedProduct?.price * selectedVoucher.discountPercentage) / 100)}</span>
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
                        </>
                      )}
                    </div>
                  )}

                  {/* Phương thức thanh toán - THÊM PHẦN NÀY */}
                  <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <i className="fas fa-credit-card text-blue-500"></i>
                      Phương thức thanh toán
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod("VNPay")}
                        className={`group relative flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                          paymentMethod === "VNPay"
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100"
                            : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className="relative flex items-center bg-blue-600 text-white px-2.5 py-1 rounded">
                            <span className="font-bold text-yellow-300 mr-0.5 text-sm">
                              VN
                            </span>
                            <span className="font-bold text-sm">PAY</span>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                          </div>
                        </div>
                        <span className="text-sm mt-1">Thanh toán online</span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod("Cash")}
                        className={`group relative flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                          paymentMethod === "Cash"
                            ? "border-green-500 bg-green-50 text-green-600 shadow-lg shadow-green-100"
                            : "border-gray-200 hover:border-green-500 hover:bg-green-50"
                        }`}
                      >
                        <i className="fas fa-money-bill-wave text-lg group-hover:scale-110 transition-transform"></i>
                        <span className="text-sm mt-1">Tiền mặt khi nhận hàng</span>
                      </button>
                    </div>
                  </div>

                  {/* Form thông tin với animation khi focus */}
                  <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <i className="fas fa-user-circle text-blue-500"></i>
                      Thông tin người nhận
                    </h4>
                    {[
                      { name: "name", label: "Họ tên", icon: "fas fa-user" },
                      {
                        name: "phone",
                        label: "Số điện thoại",
                        icon: "fas fa-phone",
                      },
                      {
                        name: "address",
                        label: "Địa chỉ",
                        icon: "fas fa-map-marker-alt",
                      },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className="relative transform transition-all duration-300 hover:-translate-y-0.5 mb-3 last:mb-0"
                      >
                        <div className="flex items-center bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                          <span className="pl-3">
                            <i
                              className={`${field.icon} text-gray-400 group-hover:text-blue-500 transition-colors`}
                            ></i>
                          </span>
                          <input
                            className="w-full pl-3 pr-4 py-3 bg-transparent focus:outline-none disabled:text-gray-500 text-sm"
                            type="text"
                            placeholder={field.label}
                            value={formData[field.name]}
                            disabled={user !== null}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer với animation */}
              <div className="fixed bottom-0 right-0 w-full sm:w-[480px] bg-white border-t border-gray-200 p-4 backdrop-blur-lg bg-white/80">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Tổng thanh toán</span>
                  {selectedVoucher ? (
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through mr-2">
                        {formatCurrency(selectedProduct?.price)}
                      </span>
                      <span className="text-xl font-bold text-blue-600 animate-pulse">
                        {formatCurrency(discountedPrice)}
                      </span>
                    </div>
                  ) : (
                  <span className="text-xl font-bold text-blue-600 animate-pulse">
                      {formatCurrency(selectedProduct?.price)}
                  </span>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-[length:200%_100%] animate-gradient hover:shadow-lg hover:shadow-blue-500/25 text-white py-3.5 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {paymentMethod === "VNPay" ? (
                    <>
                      <i className="fas fa-lock animate-bounce"></i>
                      Thanh toán VNPay
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check animate-bounce"></i>
                      Đặt hàng (COD)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar */
        .scroll-smooth {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .scroll-smooth::-webkit-scrollbar {
          width: 6px;
        }

        .scroll-smooth::-webkit-scrollbar-track {
          background: transparent;
        }

        .scroll-smooth::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        .scroll-smooth::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ProductList;
