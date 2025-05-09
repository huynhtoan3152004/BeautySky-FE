import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage/Homepage.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Product from "./pages/Product/Product.jsx";
import ProductDetail from "./pages/Product/ProductDetail.jsx";
import OrderSuccess from "./pages/Checkout/OrderSuccess.jsx";
import ViewOrder from "./pages/Orders/ViewOrder.jsx";
import Viewcart from "./pages/Product/Viewcart.jsx";
import Quizz from "./features/quiz/QuizPage.jsx";
import RoutineBuilderPage from "./features/skincare-routine/RoutineBuilderPage.jsx";
import Error from "./pages/Errors/NotFoundPage.jsx";
import Blog from "./pages/Blogs/BlogPage.jsx";
import UserProfile from "./pages/Profile/pages/ProfileForm.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import DashboardLayout from "./pages/DashBoard/DashboardLayout.jsx";
import Dashboard from "./pages/DashBoard/pages/DashBoardControll/pages/Dashboard.jsx";
import Customers from "./pages/DashBoard/pages/Customers.jsx";
import Order from "./pages/DashBoard/pages/Order.jsx";
import Products from "./pages/DashBoard/pages/Products.jsx";
import Report from "./pages/DashBoard/pages/Report.jsx";
import BlogManagement from "./pages/DashBoard/pages/BlogManagement.jsx";
import Promotion from "./pages/DashBoard/pages/Promotion.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import Events from "./pages/DashBoard/pages/EventsControll.jsx";
import HistoryOrder from "./pages/Orders/ViewHistoryOrder.jsx";
import OrderDetail from "./pages/Orders/OrderDetail.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import ProfileAdmin from "./pages/DashBoard/pages/ProfileAdmin.jsx";
import ProfileLayout from "./pages/Profile/ProfileLayout.jsx";
import Unauthorized from "./pages/Unauthorized/unauthorized.jsx";
import UpdateProfile from './components/Google/UpdateProfile';
import GoogleCallback from './components/Google/GoogleCallback';
import UserRoutinePage from "./pages/Profile/pages/UserRoutinePage.jsx";
import PaymentCallback from './pages/Payment/PaymentCallback.jsx';
import PaymentSuccess from './pages/Payment/PaymentSuccess.jsx';
import PaymentFailed from './pages/Payment/PaymentFailed.jsx';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuizController from "./pages/DashBoard/pages/QuizController.jsx";
import RoutineController from "./pages/DashBoard/pages/RoutineController.jsx";
import ShoppingGuide from "./pages/Policy/ShoppingGuide.jsx";
import CompanyPolicy from "./pages/Policy/CompanyPolicy.jsx";
// Main Application
const App = () => (
  <Routes>
    {" "}
    {/* Không có Router ở đây */}
    <Route path="/" element={<Home />} />
    <Route path="/aboutus" element={<AboutUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/product" element={<Product />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/ordersuccess" element={<OrderSuccess />} />
    <Route path="/paymentcallback" element={<PaymentCallback />} />
    <Route path="/paymentsuccess" element={<PaymentSuccess />} />
    <Route path="/paymentfailed" element={<PaymentFailed />} />
    <Route path="/vieworder" element={<ViewOrder />} />
    <Route path="/viewcart" element={<Viewcart />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/quizz" element={<Quizz />} />
    <Route path="/RoutineBuilderPage" element={<RoutineBuilderPage />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="*" element={<Error />} />
    <Route path="/routine-builder" element={<RoutineBuilderPage />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/update-profile" element={<UpdateProfile />} />
    <Route path="/google-callback" element={<GoogleCallback />} />
    <Route path="/shopping-guide" element={<ShoppingGuide />} />
    <Route path="/company-policy" element={<CompanyPolicy />} />
    {/* Dashboard Routes (Chỉ Manager và Staff mới truy cập) */}
    <Route
      path="/dashboardlayout"
      element={
        <ProtectedRoute requiredRole={[2, 3]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      {/* Chỉ Manager mới thấy Dashboard */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute requiredRole={3}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Cả Manager & Staff đều thấy */}
      <Route path="blogs" element={<BlogManagement />} />
      <Route path="promotions" element={<Promotion />} />
      <Route index element={<Customers />} />
      <Route path="orders" element={<Order />} />
      <Route path="products" element={<Products />} />
      <Route path="reports" element={<Report />} />
      <Route path="events" element={<Events />} />
      <Route path="quizzes" element={<QuizController/>} />
      <Route path="routines" element={<RoutineController/>} />
      <Route path="profileadmin" element={<ProfileAdmin />} />
    </Route>
    {/*Layout ProfileProfile */}
    <Route path="/profilelayout" element={<ProfileLayout />}>
      <Route index element={<UserProfile />} />
      <Route path="historyorder" element={<HistoryOrder />} />
      <Route path="orderdetail/:orderId" element={<OrderDetail />} />
      <Route path="my-routines" element={<UserRoutinePage />} />
    </Route>
  </Routes>
);

export default App;
