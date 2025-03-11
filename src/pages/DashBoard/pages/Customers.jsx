import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useUsersContext } from "../../../context/UserContext";
import usersAPI from "../../../services/users";
import Swal from "sweetalert2";
import { useOrdersContext } from "../../../context/OrdersContext";
import { Plus } from "lucide-react";

const Customers = () => {
  const { users, fetchUsers } = useUsersContext();
  const { orders, setOrders } = useOrdersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    roleId: 2, // Mặc định là Staff
  });

  useEffect(() => {
    fetchUsers();
    const fetchOrdersData = async () => {
      try {
        const data = await orderAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  useEffect(() => {
    const filtered = users.filter((customer) => {
      const nameMatch = searchTerm
        .toLowerCase()
        .split("")
        .every((char) =>
          customer.fullName.toLowerCase().replace(/\s+/g, "").includes(char)
        );

      const customerDate = new Date(customer.dateCreate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const dateMatch =
        (!start || customerDate >= start) && (!end || customerDate <= end);

      return nameMatch && dateMatch;
    });

    setFilteredCustomers(filtered);
  }, [users, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const goToPage = (page) => setCurrentPage(page);

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return { name: "User", color: "bg-blue-500" };
      case 2:
        return { name: "Staff", color: "bg-yellow-500" };
      case 3:
        return { name: "Manager", color: "bg-red-500" };
      default:
        return { name: "Unknown", color: "bg-gray-500" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEditUser = (user) => {
    setEditingUser(user); // Đánh dấu đang chỉnh sửa user
    setNewUser({
      userName: user.userName || "",
      fullName: user.fullName || "",
      email: user.email || "",
      password: "", // Không hiển thị password cũ vì bảo mật
      confirmPassword: "", // Không hiển thị password cũ vì bảo mật
      phone: user.phone || "",
      address: user.address || "",
      roleId: user.roleId || 2,
    });
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    console.log("Đang xóa người dùng với ID:", userId);

    if (!userId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy ID người dùng",
        icon: "error",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          // Chi tiết hóa lỗi từ phản hồi
          const response = await usersAPI.deleteUser(userId);
          console.log("Phản hồi xóa người dùng:", response);

          await fetchUsers(); // Tải lại danh sách người dùng
          Swal.fire({
            title: "Đã xóa!",
            text: "Người dùng đã được xóa thành công.",
            icon: "success",
          });
        } catch (error) {
          // Chi tiết hóa thông báo lỗi
          console.error("Chi tiết lỗi:", error.response);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Không thể xóa người dùng. Vui lòng thử lại sau.";

          Swal.fire({
            title: "Lỗi!",
            text: errorMessage,
            icon: "error",
            footer: `Mã lỗi: ${error.response?.status || "Không xác định"}`,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi không mong muốn.",
        icon: "error",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!newUser.fullName || !newUser.email) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const userPayload = {
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        roleId: newUser.roleId,
      };

      // Chỉ gửi password nếu người dùng đã nhập
      if (newUser.password && newUser.password === newUser.confirmPassword) {
        userPayload.password = newUser.password;
      } else if (
        newUser.password &&
        newUser.password !== newUser.confirmPassword
      ) {
        Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
        return;
      }

      // Thêm console.log ở đây để debug
      console.log("Editing user:", editingUser);
      console.log("User ID:", editingUser.id);
      console.log("Payload:", userPayload);

      // Chỉ gửi password nếu người dùng đã nhập
      if (newUser.password && newUser.password === newUser.confirmPassword) {
        userPayload.password = newUser.password;
      } else if (
        newUser.password &&
        newUser.password !== newUser.confirmPassword
      ) {
        Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
        return;
      }
      // Thêm console.log ở đây để debug
      console.log("Editing user:", editingUser);
      console.log("User ID:", editingUser.id);
      console.log("Payload:", userPayload);

      const response = await usersAPI.editUser(editingUser.userId, userPayload);

      if (response.status >= 200 && response.status < 300) {
        Swal.fire(
          "Thành công!",
          "Thông tin thành viên đã được cập nhật.",
          "success"
        );
        fetchUsers();
        setShowAddUserModal(false);
        setEditingUser(null);
        setNewUser({
          userName: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          roleId: 2,
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể cập nhật thông tin thành viên.", "error");
      console.error("Error updating user:", error);
    }
  };

  const getOrderCount = (customerId) => {
    if (!orders || !Array.isArray(orders)) {
      return 0;
    }

    return orders.filter((order) => order.customerId === customerId).length;
  };

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }
    try {
      const response = await usersAPI.createUser(newUser);
      if (response.status >= 200 && response.status < 300) {
        Swal.fire("Thành công!", "Thành viên đã được thêm.", "success");
        fetchUsers();
        setShowAddUserModal(false);
        setNewUser({
          userName: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          roleId: 2,
        });
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể thêm thành viên.", "error");
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600"
          onClick={() => setShowAddUserModal(true)}
        >
          {editingUser ? <FaEdit size={20} /> : <Plus size={20} />}
          {editingUser ? "Chỉnh sửa thành viên" : "Thêm thành viên"}
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Search Bar + Date Filters */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          {/* Search Name */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Modal thêm thành viên */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">
                {editingUser ? "Cập nhật thành viên" : "Thêm thành viên"}
              </h2>
              <input
                type="text"
                placeholder="Tên tài khoản"
                className="w-full p-2 border rounded mb-2"
                value={newUser.userName}
                onChange={(e) =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-2 border rounded mb-2"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded mb-2"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full p-2 border rounded mb-2"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="w-full p-2 border rounded mb-2"
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full p-2 border rounded mb-2"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                className="w-full p-2 border rounded mb-2"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded mb-2"
                value={newUser.roleId}
                onChange={(e) =>
                  setNewUser({ ...newUser, roleId: Number(e.target.value) })
                }
              >
                <option value={2}>Staff</option>
                <option value={3}>Manager</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                >
                  {editingUser ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Table */}
        {filteredCustomers.length > 0 ? (
          <>
            <table className="w-full border-collapse bg-white shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Orders</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Ngày Tạo</th>
                  <th className="p-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer) => {
                  console.log("Thông tin người dùng:", customer); // Thêm dòng này
                  const { name, color } = getRoleName(customer.roleId);
                  return (
                    <tr key={customer.id} className="border-t">
                      <td className="p-3 flex items-center gap-2">
                        <FaUser className="text-blue-500" /> {customer.fullName}
                      </td>
                      <td className="p-3">{customer.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${color}`}
                        >
                          {name}
                        </span>
                      </td>
                      <td className="p-3">{getOrderCount(customer.userId)}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            customer.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3">{formatDate(customer.dateCreate)}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEditUser(customer)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500"
                          // Thay đổi từ customer.id sang customer.userId
                          onClick={() =>
                            handleDeleteUser(customer.userId || customer.id)
                          }
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Box */}
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Không có khách hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
