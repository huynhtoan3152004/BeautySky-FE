import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Star, Sun, Droplet } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import PaginationComponent from "../../components/Pagination/Pagination.jsx";
import ProductList from "./ProductList";

const ProductsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { addToCart } = useCart();
  const { products } = useDataContext(); // Lấy dữ liệu từ backend
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSkinType, selectedCategory]);

  // Bộ lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const skinTypeFilter =
      selectedSkinType === "Tất cả" ||
      (product.skinType?.skinTypeId && product.skinType?.skinTypeId === selectedSkinType);
  
    const categoryFilter =
      selectedCategory === "Tất cả" ||
      (product.category?.categoryName && product.category?.categoryName === selectedCategory);
  
    return skinTypeFilter && categoryFilter;
  });
  
  // Sắp xếp sản phẩm theo giá
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [filteredProducts, sortOrder]);

  // Phân trang sản phẩm
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-6">
        <h1 className="text-5xl font-extrabold text-[#6BBCFE] text-center mb-8 drop-shadow-md">
          ✨ Khám phá Sản Phẩm Skincare ✨
        </h1>
        <div className="flex gap-8 max-w-[1440px] mx-auto">
          {/* Sidebar */}
          <div className="w-1/4 p-6 bg-white shadow-lg rounded-2xl border border-gray-200 h-fit sticky top-20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Filter size={20} className="text-black" /> Bộ lọc
            </h2>

            {/* Loại da filter */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                <Droplet size={18} className="text-blue-400" /> Loại da
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Tất cả", "Da Dầu", "Da Khô", "Da Thường", "Da Hỗn Hợp", "Da Nhạy Cảm"].map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border border-gray-300 hover:bg-purple-100 hover:text-purple-600 shadow-md ${selectedSkinType === type ? "bg-gray-500 text-white" : "bg-white"}`}
                    onClick={() => setSelectedSkinType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Loại sản phẩm filter */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                <Sun size={18} className="text-yellow-400" /> Loại sản phẩm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Tất cả", "Tẩy trang", "Sữa rửa mặt", "Toner", "Serum", "Kem Dưỡng", "Kem Chống Nắng"].map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border border-gray-300 hover:bg-pink-100 hover:text-pink-600 shadow-md ${selectedCategory === category ? "bg-gray-500 text-white" : "bg-white"}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-600">🌸 Sản phẩm nổi bật 🌸</h2>
              <button
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg flex items-center gap-2 shadow-md"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <Star size={20} /> Sắp xếp
              </button>
            </div>

            {/* Kiểm tra nếu không có sản phẩm */}
            {sortedProducts.length === 0 ? (
              <div className="text-center text-gray-500">Không có sản phẩm nào được tìm thấy.</div>
            ) : (
              <>
                <ProductList products={currentProducts} addToCart={addToCart} />
                <PaginationComponent
                  itemsPerPage={itemsPerPage}
                  totalItems={sortedProducts.length}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
