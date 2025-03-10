import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Star, Sun, Droplet } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import PaginationComponent from "../../components/Pagination/Pagination.jsx";
import ProductList from "./ProductList";

const ITEMS_PER_PAGE = 12; // Đồng bộ với ProductList.js

const ProductsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { addToCart } = useCart();
  const { products, fetchProduct, isLoading } = useDataContext(); // Đảm bảo fetchProduct được gọi khi cần
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchProduct(); // Gọi fetchProduct khi bộ lọc thay đổi
    setCurrentPage(1);
  }, [selectedSkinType, selectedCategory]);

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
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Droplet size={18} className="text-blue-500" /> Loại da
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Tất cả",
                  "Da Dầu",
                  "Da Khô",
                  "Da Thường",
                  "Da Hỗn Hợp",
                  "Da Nhạy Cảm",
                ].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 shadow-md ${
                      selectedSkinType === type
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-blue-100 hover:text-blue-600"
                    }`}
                    onClick={() => setSelectedSkinType(type)}
                    aria-pressed={selectedSkinType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {/* Loại sản phẩm filter */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Sun size={18} className="text-yellow-500" /> Loại sản phẩm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Tất cả",
                  "Tẩy trang",
                  "Sữa rửa mặt",
                  "Toner",
                  "Serum",
                  "Kem Dưỡng",
                  "Kem Chống Nắng",
                ].map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 shadow-md ${
                      selectedCategory === category
                        ? "bg-yellow-500 text-white"
                        : "bg-white hover:bg-yellow-100 hover:text-yellow-600"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
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
              <h2 className="text-3xl font-bold text-gray-600">
                🌸 Sản phẩm nổi bật 🌸
              </h2>
              <button
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg flex items-center gap-2 shadow-md"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <Star size={20} /> Sắp xếp
              </button>
            </div>
            {/* ProductList */}
            <ProductList
              selectedSkinType={selectedSkinType}
              selectedCategory={selectedCategory}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
