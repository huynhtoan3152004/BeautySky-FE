import React, { useEffect, useState } from "react";
import reviewsAPI from "../../../services/reviews";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ReactPaginate from "react-paginate";
import "tailwindcss/tailwind.css";

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch reviews", "error");
    }
  };

  const handleDeleteReview = async (review) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Bạn sắp xóa đánh giá cho sản phẩm ${review.productName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vâng, xóa ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await reviewsAPI.deleteReviews(review.reviewId);

          if (response.status === 200) {
            setReviews(reviews.filter((r) => r.reviewId !== review.reviewId));
            Swal.fire("Deleted!", "Bài đánh giá đã được xóa", "success");
          } else {
            throw new Error("Lỗi không xác định khi xóa");
          }
        } catch (error) {
          if (error.response?.status === 404) {
            Swal.fire("Lỗi", "Không tìm thấy bài đánh giá", "error");
          } else {
            Swal.fire("Lỗi", "Lỗi xóa đánh giá", "error");
          }
        }
      }
    });
  };

  const filteredReviews = reviews.filter((review) =>
    Object.values(review).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
  const offset = currentPage * reviewsPerPage;
  const currentReviews = filteredReviews.slice(offset, offset + reviewsPerPage);

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Product Reviews
      </h2>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-52 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 mb-4"
      />
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-left">Người dùng</th>
              <th className="p-3 text-left">Đánh giá</th>
              <th className="p-3 text-left">Bình luận</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr
                key={review.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{review.reviewId}</td>
                <td className="p-3">{review.productName}</td>
                <td className="p-3">{review.userName}</td>
                <td className="p-3 text-yellow-500">{review.rating} ⭐</td>
                <td className="p-3">{review.comment}</td>
                <td className="p-3">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                    onClick={() => handleDeleteReview(review)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName="flex justify-center space-x-2 mt-4"
        pageClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white"
        activeClassName="bg-blue-500 text-white"
        previousClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gray-300"
        nextClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gray-300"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default ProductReviews;
