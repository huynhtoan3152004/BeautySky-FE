import {
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaHome,
  FaCog,
  FaTags,
  FaFileAlt,
  FaBlog,
  FaCalendarAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 p-5 flex flex-col space-y-6 h-screen shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-white">Admin Panel</h2>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          <NavItem
            icon={<FaUsers />}
            title="Khách hàng"
            to="/dashboardlayout"
          />
          <NavItem
            icon={<FaChartBar />}
            title="Doanh thu"
            to="/dashboardlayout/dashboard"
          />
          <NavItem icon={<FaHome />} title="Cửa hàng" to="/" />

          <NavItem
            icon={<FaShoppingCart />}
            title="Orders"
            to="/dashboardlayout/orders"
          />
          <NavItem
            icon={<FaBox />}
            title="Sản phẩm"
            to="/dashboardlayout/products"
          />
          <NavItem
            icon={<FaBlog />}
            title="Blogs"
            to="/dashboardlayout/blogs"
          />
          <NavItem
            icon={<FaTags />}
            title="Khuyến mãi"
            to="/dashboardlayout/promotions"
          />
          <NavItem
            icon={<FaFileAlt />}
            title="Báo cáo"
            to="/dashboardlayout/reports"
          />
          <NavItem
            icon={<FaCalendarAlt />}
            title="Sự kiện"
            to="/dashboardlayout/events"
          />
          <NavItem
            icon={<FaCog />}
            title="Cài đặt"
            to="/dashboardlayout/settings"
          />
        </ul>
      </nav>
    </aside>
  );
};

// Component NavItem với hiệu ứng hover và active
const NavItem = ({ icon, title, to }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:scale-105"
        }`
      }
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-lg">{title}</span>
    </NavLink>
  </li>
);

export default Sidebar;
