import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import paymentAPI from '../../services/payment';

const PaymentCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const processPayment = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
                const vnp_TxnRef = queryParams.get('vnp_TxnRef');

                // Kiểm tra nếu là hủy thanh toán
                if (vnp_ResponseCode === '24') {
                    navigate('/paymentfailed', {
                        state: {
                            error: 'Bạn đã hủy thanh toán',
                            orderId: vnp_TxnRef
                        }
                    });
                    return;
                }

                // Gọi API để xử lý payment callback
                const response = await paymentAPI.processVnPayCallback(location.search);

                if (response.status === 200) {
                    const { orderId, paymentId } = response.data;
                    navigate('/paymentsuccess', {
                        state: {
                            orderId: orderId,
                            paymentId: paymentId,
                            message: 'Thanh toán thành công!',
                            status: 'Completed'
                        }
                    });
                } else {
                    throw new Error(response.data?.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
                }
            } catch (error) {
                console.error('Payment processing error:', error);
                
                // Xử lý các loại lỗi cụ thể
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            navigate('/paymentfailed', {
                                state: {
                                    error: 'Không tìm thấy đơn hàng',
                                    orderId: error.response.data?.orderId
                                }
                            });
                            break;
                        case 400:
                            navigate('/paymentfailed', {
                                state: {
                                    error: 'Đơn hàng không hợp lệ hoặc đã được thanh toán',
                                    orderId: error.response.data?.orderId
                                }
                            });
                            break;
                        default:
                            setError(error.response.data?.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
                            setIsProcessing(false);
                    }
                } else if (error.message === 'redirect') {
                    // Nếu là lỗi redirect, chuyển hướng đến trang lỗi
                    navigate('/paymentfailed', {
                        state: {
                            error: 'Có lỗi xảy ra trong quá trình thanh toán',
                            orderId: location.search.includes('vnp_TxnRef') ? 
                                new URLSearchParams(location.search).get('vnp_TxnRef') : null
                        }
                    });
                } else {
                    setError(error.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
                    setIsProcessing(false);
                }
            }
        };

        processPayment();
    }, [location, navigate]);

    if (isProcessing) {
        return (
            <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin text-blue-500 mb-4">
                            <FaSpinner className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Đang xử lý thanh toán
                        </h2>
                        <div className="space-y-2 text-center">
                            <p className="text-gray-600">
                                Vui lòng không tắt hoặc reload trang...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                    <div className="flex flex-col items-center">
                        <div className="text-red-500 mb-4">
                            <FaExclamationTriangle className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Có lỗi xảy ra
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            {error}
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => navigate('/viewcart')}
                                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaShoppingCart className="mr-2" />
                                Quay lại giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            <Footer />
            </>
        );
    }

    return null;
};

export default PaymentCallback;