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
  FaBars,
  FaQuestion,
  FaClock,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-3 rounded-full 
        bg-gradient-to-r from-purple-600 to-blue-600 text-white
        shadow-lg hover:shadow-blue-500/50 transition-all duration-300
        hover:scale-110 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      <aside 
        className={`fixed lg:relative w-72 bg-gradient-to-b from-gray-900 to-gray-800 
        flex flex-col h-screen shadow-2xl transition-all duration-500 ease-in-out
        border-r border-gray-700/50 backdrop-blur-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-10`}
      >
        <div className="p-6 border-b border-gray-700/50">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
              text-transparent bg-clip-text tracking-wider lg:block md:hidden sm:hidden">
              Admin Panel
            </h2>
            <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full 
              w-3/4 mx-auto transform transition-all duration-300 hover:scale-x-100"></div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="p-6">
            <ul className="space-y-3">
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
              <NavItem 
                icon={<FaHome />} 
                title="Cửa hàng" 
                to="/" 
              />
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
                icon={<FaClock />}
                title="Lộ trình"
                to="/dashboardlayout/routines"
              />
              <NavItem
                icon={<FaQuestion />}
                title="Q & A"
                to="/dashboardlayout/quizzes"
              />
              <NavItem
                icon={<FaCog />}
                title="Cài đặt"
                to="/dashboardlayout/settings"
              />
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm text-center">
            © 2025 Admin Dashboard
          </p>
        </div>
      </aside>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }
      `}</style>
    </>
  );
};

const NavItem = ({ icon, title, to }) => (
  <li className="transform transition-all duration-200 hover:translate-x-2">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-4 px-4 py-3 rounded-xl cursor-pointer
        transition-all duration-300 group relative overflow-hidden
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
        }`
      }
    >
      <div className="text-2xl transition-transform duration-300 group-hover:scale-110 
        group-hover:rotate-3">
        {icon}
      </div>

      <span className="text-base font-medium tracking-wide lg:block md:hidden sm:hidden">
        {title}
      </span>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </NavLink>
  </li>
);

export default Sidebar;