import React, { useState, useEffect } from "react";
import blogsAPI from "../../../services/blogs";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Delete Blog
  const handleDelete = async (blogId) => {
    try {
      await blogsAPI.deleteProduct(blogId);
      setBlogs(blogs.filter((blog) => blog.blogId !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Handle Edit Blog (this can open a modal or navigate to an edit page)
  const handleEdit = (blogId) => {
    alert(`Editing blog with ID: ${blogId}`);
    // You can implement an editing modal or navigate to an edit page
  };

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Filtered and paginated blogs
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Quản lí Blogs</h2>
        <input
          type="text"
          placeholder="Tìm kiếm blogs..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded-md w-1/3"
        />
      </div>

      <table className="w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4 text-left">Hình ảnh</th>
            <th className="py-2 px-4 text-left">Tiêu đề</th>
            <th className="py-2 px-4 text-left">Danh mục</th>
            <th className="py-2 px-4">Ngày tạo</th>
            <th className="py-2 px-4">Trạng thái</th>
            <th className="py-2 px-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog) => (
            <tr key={blog.blogId} className="border-t">
              <td className="py-2 px-4 text-center">{blog.blogId}</td>
              <td className="py-2 px-4">
                <img
                  src={blog.imgURL}
                  alt={blog.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="py-2 px-4">{blog.title}</td>
              <td className="py-2 px-4">{blog.category}</td>
              <td className="py-2 px-4 text-center">
                {blog.createdDate.split("T")[0]}
              </td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    blog.status === "Published"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {blog.status}
                </span>
              </td>
              <td className="py-2 px-4 flex justify-center space-x-3">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleEdit(blog.blogId)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(blog.blogId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;
