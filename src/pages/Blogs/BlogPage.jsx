import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";
import blogs from "./DataBlogs";

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lọc bài viết theo loại da và danh mục
  const filteredBlogs = blogs.filter(
    (blog) =>
      (selectedSkinType === "All" || blog.skinType === selectedSkinType) &&
      (selectedCategory === "All" || blog.category === selectedCategory)
  );

  // Tính số trang
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý hiệu ứng ẩn/hiện modal
  useEffect(() => {
    if (selectedBlog) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [selectedBlog]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-4xl font-bold mb-6 text-[#6bbcfe]">
          Bài Viết Mới Nhất
        </h2>

        {/* Bộ lọc */}
        <div className="mb-4 flex gap-4">
          <select
            value={selectedSkinType}
            onChange={(e) => setSelectedSkinType(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Tất cả loại da</option>
            <option value="Da Dầu">Da Dầu</option>
            <option value="Da Khô">Da Khô</option>
            <option value="Da Thường">Da Thường</option>
            <option value="Da Nhạy Cảm">Da Nhạy Cảm</option>
            <option value="Da Hỗn Hợp">Da Hỗn Hợp</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Tất cả sản phẩm</option>
            <option value="Tẩy trang">Tẩy trang</option>
            <option value="Sữa rửa mặt">Sữa rửa mặt</option>
            <option value="Toner">Toner</option>
            <option value="Serum">Serum</option>
            <option value="Kem Dưỡng">Kem Dưỡng</option>
            <option value="Kem Chống Nắng">Kem Chống Nắng</option>
          </select>
        </div>

        {/* Hiển thị danh sách bài viết */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {paginatedBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedBlog(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Đọc Thêm
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Hiển thị Modal bài viết */}
      {selectedBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setSelectedBlog(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-300px object-cover mb-4 rounded-md"
            />
            <p className="text-gray-700 leading-relaxed">
              {selectedBlog.content}
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Blogs;
