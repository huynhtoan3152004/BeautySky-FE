import {
  FaChartBar,
  FaUsers,
  FaBox,
  FaHome,
  FaCog,
  FaTags,
  FaFileAlt,
  FaBlog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useUsersContext } from "../../../../context/UserContext";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user: authUser, logout } = useAuth();
  const { users, fetchUsers } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      if (foundUser) {
        setCurrentUser(foundUser);
      }
    }
  }, [authUser, users]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-blue-100 p-5 flex flex-col space-y-6 h-screen shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-black">Profile</h2>

      {/* User Info Section */}
      <div className="text-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {currentUser?.fullName || "Guest"}
        </h2>
        <p className="text-gray-500 text-base">
          {currentUser?.email || "No email available"}
        </p>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          <NavItem icon={<FaUsers />} title="Profile" to="/profilelayout" />
          <NavItem
            icon={<FaChartBar />}
            title="Orders"
            to="/profilelayout/historyorder"
          />
          <NavItem icon={<FaHome />} title="Cửa hàng" to="/" />
          <NavItem
            icon={<FaFileAlt />}
            title="Báo cáo"
            to="/dashboardlayout/reports"
          />
          <NavItem
            icon={<FaCog />}
            title="Cài đặt"
            to="/dashboardlayout/settings"
          />

          {/* Logout Button */}
          <li
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 text-black hover:bg-red-400"
          >
            <FaSignOutAlt className="text-2xl" />
            <span className="text-lg">Logout</span>
          </li>
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
                  ? "bg-blue-300 text-black shadow-md"
                  : "text-black hover:bg-blue-500 hover:scale-105"
              }`
      }
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-lg">{title}</span>
    </NavLink>
  </li>
);

export default Sidebar;
