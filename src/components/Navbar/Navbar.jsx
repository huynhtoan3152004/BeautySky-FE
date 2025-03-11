import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // 🆕 Import useAuth
import { NavbarMenu } from "../Navbar/Data";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { Menu, Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import productAPI from "../../services/product";
import blogsAPI from "../../services/blogs";
import categoryApi from "../../services/category";
import skinTypeApi from "../../services/skintype";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const [products, blogs, categories, skinTypes] = await Promise.all([
        productAPI.searchProduct(searchQuery),
        blogsAPI.searchBlogs(searchQuery),
        categoryApi.searchCategory(searchQuery),
        skinTypeApi.searchSkinType(searchQuery),
      ]);

      setSearchResults([...products, ...blogs, ...categories, ...skinTypes]);
      setShowProductDropdown(true);
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
      {user?.roleId === 2 || user?.roleId === 3 ? (
        <Menu.Item key="dashboard">
          <Link to="/dashboardlayout">Quản trị hệ thống</Link>
        </Menu.Item>
      ) : null}
      <Menu.Item key="profile">
        <Link to="/profilelayout">Tài khoản của bạn</Link>
      </Menu.Item>
      <Menu.Item key="Quizz">
        <Link to="/quizz">Kiểm tra loại da</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md pr-1 pl-1">
      <div className="container mx-auto flex justify-between items-center py-4 px-1">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-16" />
            <img src={Namebrand} alt="Tên thương hiệu" className="w-32" />
          </Link>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-4 text-gray-700 font-semibold">
          {NavbarMenu.map((item) => (
            <li key={item.id} className="relative flex items-center gap-2">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.submenu ? (
                <button
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onClick={() => setShowProductDropdown((prev) => !prev)}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-2"
                >
                  {item.title}
                </button>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-2"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-35 md:w-32 border border-gray-300 rounded-full px-4 py-1 focus:outline-none focus:border-primary"
            />
            <button onClick={handleSearch} className="absolute right-3 top-2">
              <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE]" />
            </button>
            {showProductDropdown && (
              <div className="absolute bg-white shadow-md mt-2 w-full z-10 p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <Link
                      key={index}
                      to={`/${item.type}/${item.id}`}
                      className="block p-2 hover:bg-gray-100"
                    >
                      {item.name || item.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">Không tìm thấy kết quả</p>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/viewcart"
            className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-2 px-4 rounded-full"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 🆕 User Section */}
          {user ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={
                  user.avatar ||
                  "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
                }
                style={{ cursor: "pointer" }}
              />
            </Popover>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 transition duration-200"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
