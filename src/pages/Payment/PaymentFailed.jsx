import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaHome, FaShoppingCart, FaBan } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const PaymentFailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { error, orderId, isCanceled, code } = location.state || {};

    return (
       <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                    {/* Icon và Tiêu đề */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-bounce">
                        {isCanceled ? (
                            <FaBan className="text-red-500 text-4xl" />
                        ) : (
                            <FaTimes className="text-red-500 text-4xl" />
                        )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
                        {isCanceled ? 'Thanh toán đã bị hủy' : 'Thanh toán thất bại'}
                    </h2>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="space-y-4 mb-8">
                    {orderId && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-center">
                                <span className="text-gray-600">Mã đơn hàng: </span>
                                <span className="font-semibold text-gray-800">{orderId}</span>
                            </p>
                        </div>
                    )}
                    <div className={`${isCanceled ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'} border rounded-lg p-4`}>
                        <p className={`${isCanceled ? 'text-yellow-600' : 'text-red-600'} text-center`}>
                            {error || (isCanceled ? 'Bạn đã hủy thanh toán' : 'Có lỗi xảy ra trong quá trình thanh toán')}
                        </p>
                        {code && (
                            <p className="text-gray-500 text-sm text-center mt-2">
                                Mã lỗi: {code}
                            </p>
                        )}
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button 
                        onClick={() => navigate('/profilelayout/historyorder')}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                    >
                        <FaShoppingCart className="text-lg" />
                        <span>Thanh toán lại</span>
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                    >
                        <FaHome className="text-lg" />
                        <span>Về trang chủ</span>
                    </button>
                </div>

                {/* Thông tin hỗ trợ */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Nếu bạn cần hỗ trợ, vui lòng liên hệ
                    </p>
                    <a 
                        href="tel:1900xxxx" 
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm mt-1 inline-block"
                    >
                        Hotline: 1900 xxxx
                    </a>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default PaymentFailed;