import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import { Menu, Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Logo from "../public/images/logo.png";
import Namebrand from "../public/images/namebrand.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${searchQuery}`
      );
      const data = await response.json();
      console.log("Search Results:", data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/dashboardlayout/profileadmin">Tài khoản của bạn</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md px-4">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-14 h-auto" />
          <img src={Namebrand} alt="Tên thương hiệu" className="w-32 h-auto" />
        </Link>

        {/* Search Bar */}
        <div className="relative w-60 md:w-72 lg:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#6BBCFE] transition"
          />
          <button onClick={handleSearch} className="absolute right-4 top-2.5">
            <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE] text-xl" />
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={
                  user.avatar ||
                  "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
                }
                className="cursor-pointer border border-gray-300 hover:border-[#6BBCFE] transition"
              />
            </Popover>
          ) : (
            <Link
              to="/login"
              className="bg-[#6BBCFE] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#4BA6E5] transition duration-200"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
