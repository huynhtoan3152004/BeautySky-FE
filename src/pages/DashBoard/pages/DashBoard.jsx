import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../charts/SalesChart";
import RevenueChart from "../charts/RevenueChart";
import CustomersChart from "../charts/CustomersChart";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaMoneyBillWave,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";
import { useUsersContext } from "../../../context/UserContext";
import { useDataContext } from "../../../context/DataContext";
import orderAPI from "../../../services/order";

const Dashboard = () => {
  const { users } = useUsersContext();
  const { products } = useDataContext();
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getAll(); // Gọi API lấy tất cả đơn hàng
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Tính tổng doanh thu từ các đơn hoàn thành
    const totalRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    setRevenue(totalRevenue);

    // Tính doanh thu theo tháng
    const monthlyRevenue = {};
    const monthlySales = {};

    orders.forEach((order) => {
      if (order.status === "Completed") {
        const orderDate = new Date(order.orderDate);
        const month = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`; // YYYY-MM

        // Doanh thu theo tháng
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = 0;
        }
        monthlyRevenue[month] += order.totalAmount;

        // Số đơn hàng theo tháng
        if (!monthlySales[month]) {
          monthlySales[month] = 0;
        }
        monthlySales[month] += 1;
      }
    });

    // Convert object thành mảng để hiển thị trên biểu đồ
    setRevenueGrowth(
      Object.keys(monthlyRevenue).map((month) => ({
        month,
        revenue: monthlyRevenue[month],
      }))
    );

    setSalesData(
      Object.keys(monthlySales).map((month) => ({
        month,
        sales: monthlySales[month],
      }))
    );
  }, [orders]);

  useEffect(() => {
    if (users.length > 0) {
      const monthlyCustomers = {};
      users.forEach((user) => {
        const dateCreate = new Date(user.dateCreate); // Ngày đăng ký của user
        const month = `${dateCreate.getFullYear()}-${
          dateCreate.getMonth() + 1
        }`; // YYYY-MM

        if (!monthlyCustomers[month]) {
          monthlyCustomers[month] = 0;
        }
        monthlyCustomers[month] += 1; // Tăng số lượng khách hàng trong tháng đó
      });

      const customerData = Object.keys(monthlyCustomers).map((month) => ({
        month,
        customers: monthlyCustomers[month],
      }));

      setCustomerGrowth(customerData);

      const monthlyLeads = {};

      users.forEach((user) => {
        const dateCreate = new Date(user.dateCreate);
        const month = `${dateCreate.getFullYear()}-${
          dateCreate.getMonth() + 1
        }`; // YYYY-MM

        if (!monthlyLeads[month]) {
          monthlyLeads[month] = 0;
        }
        monthlyLeads[month] += 1; // Mỗi user = 1 lead
      });

      const leadDataFormatted = Object.keys(monthlyLeads).map((month) => ({
        month,
        leads: monthlyLeads[month],
      }));

      setLeadData(leadDataFormatted);
    }
  }, [users]); // Chạy khi danh sách users thay đổi

  useEffect(() => {
    if (users.length > 0 && orders.length > 0) {
      const completedOrders = orders.filter(
        (order) => order.status === "Completed"
      ).length;
      const rate = (completedOrders / users.length) * 100; // Tính %
      setConversionRate(rate.toFixed(1)); // Giữ 1 số sau dấu thập phân
    }
  }, [orders, users]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUsers />}
            title="Users"
            value={users.length}
            subtitle="Updated dynamically"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Orders"
            value={orders ? orders.length : 0} // Đảm bảo không lỗi nếu orders chưa có dữ liệu
            subtitle="Fetched from API"
          />
          <StatCard
            icon={<FaBox />}
            title="Products"
            value={products.length}
            subtitle="Stock data from API"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Revenue"
            value={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue)}
            subtitle="Real-time revenue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesChart salesData={salesData} leadData={leadData} />
          <RevenueChart revenueGrowth={revenueGrowth} />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<FaChartLine />}
            title="Conversion Rate"
            value={`${conversionRate}%`}
            subtitle="Improved from last month"
          />
          <StatCard
            icon={<FaPercentage />}
            title="Profit Margin"
            value="22.5%"
            subtitle="Stable trend"
          />
          <CustomersChart customerGrowth={customerGrowth} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
