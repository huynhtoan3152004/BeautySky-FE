import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductList = ({ selectedSkinType, selectedCategory }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, fetchProduct, SkinTypes, fetchCategories } = useDataContext();

  useEffect(() => {
    fetchProduct();
    // Log sản phẩm sau khi fetch
    console.log('All products after fetch:', products);
  }, [fetchProduct]);

  const handleAddToCart = (product) => {
    if (product.quantity === 0) {
      alert("Sản phẩm này đã hết hàng!");
      return;
    }
    addToCart({
      id: product.productId,
      name: product.productName,
      price: product.price,
      image: product.productsImages?.[0]?.imageUrl || product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  

  // Lọc sản phẩm theo loại da và loại sản phẩm
  const filteredProducts = products.filter((product) => {
    // Kiểm tra nếu selectedSkinType là "Tất cả" hoặc trùng khớp với skinType của sản phẩm
    const skinTypeFilter =
      selectedSkinType === "Tất cả" ||
      product.skinType?.skinTypeName === selectedSkinType;
    
    // Kiểm tra nếu selectedCategory là "Tất cả" hoặc trùng khớp với category của sản phẩm
    const categoryFilter =
      selectedCategory === "Tất cả" ||
      product.category?.categoryName === selectedCategory;
    
    return skinTypeFilter && categoryFilter;
  });

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center col-span-4 text-gray-500">
              Không có sản phẩm nào phù hợp.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.productsImages?.[0]?.imageUrl || product.image}
                    alt={product.productName}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
                <div className="mt-4 flex flex-col items-center flex-grow">
                  <h3 className="text-lg font-semibold text-gray-700 text-center truncate w-full">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Loại da:{" "}
                    {product.skinType?.skinTypeName || "Không xác định"}
                  </p>
                  <p className="text-sm text-gray-500 w-full text-center">
                    Loại sản phẩm:{" "}
                    {product.category?.categoryName || "Không xác định"}
                  </p>
                  <p className="text-sm text-gray-500 w-full text-center">
                    Đánh giá:{" "}
                    {product.rating ? `${product.rating} / 5` : "Chưa có đánh giá"}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    className={`w-full py-2 rounded-lg transition-all duration-300 shadow-md transform hover:scale-105 h-12 flex items-center justify-center ${
                      product.quantity === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#89CFF0] hover:bg-[#6BBCFE] text-white"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                  </button>
                  <button
                    onClick={() => handleViewDetails(product.productId)}
                    className="w-full bg-[#FF9999] text-white py-2 rounded-lg hover:bg-[#FF6666] transition-all duration-300 shadow-lg transform hover:scale-105 h-12 flex items-center justify-center"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          )}
            
        </div>
      </div>
    </div>
  );
};

export default ProductList;
