import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
  processAndConfirmPayment: async (orderId = null) => {
    try {
      let url = `${endPoint}/ProcessAndConfirmPayment`;
      
      // Nếu có orderId, thêm vào query params
      if (orderId) {
        url += `?orderId=${orderId}`;
      }

      const response = await axiosInstance.post(
        url,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Kiểm tra response status và data
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data
        };
      }

      // Xử lý các trường hợp lỗi khác
      throw new Error(response.data.message || 'Có lỗi xảy ra khi xử lý thanh toán');

    } catch (error) {
      console.error('Error in processAndConfirmPayment:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            throw new Error(data || 'Đơn hàng không tồn tại hoặc đã được xử lý');
          case 500:
            throw new Error(data || 'Lỗi server khi xử lý thanh toán');
          default:
            throw new Error(data || `Lỗi không xác định: ${status}`);
        }
      }

      // Xử lý lỗi network hoặc lỗi khác
      throw new Error(error.message || 'Không thể kết nối đến server');
    }
  },
  deletePayment: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  },
  createVNPayPayment: async (paymentData) => {
    try {
        const response = await axiosInstance.post(
            `${endPoint}/create-payment`,
            paymentData
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tạo thanh toán');
    }
},
  handlePaymentCallback: async (queryString) => {
    try {
      // Gọi API endpoint để xử lý callback từ VNPAY
      const response = await axiosInstance.get(`${endPoint}/payment-callback${queryString}`);
      
      // Kiểm tra response từ BE
      if (response.status === 200) {
          return {
              success: true,
              orderId: response.data.orderId,
              paymentId: response.data.paymentId,
              message: 'Thanh toán thành công'
          };
      }

      // Nếu có lỗi từ BE
      throw new Error(response.data?.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
  } catch (error) {
      // Xử lý các loại lỗi cụ thể từ BE
      if (error.response) {
          switch (error.response.status) {
              case 404:
                  throw new Error('Không tìm thấy đơn hàng');
              case 400:
                  throw new Error('Đơn hàng không hợp lệ hoặc đã được thanh toán');
              default:
                  throw new Error(error.response.data?.message || 'Lỗi xử lý thanh toán');
          }
      }
      
      // Nếu là lỗi network hoặc lỗi khác
      throw new Error(error.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
  }
},
  confirmDelivery: async (orderId) => {
    if (!orderId) {
      throw new Error('OrderId là bắt buộc');
    }

    try {
      const response = await axiosInstance.post(
        `${endPoint}/confirm-delivery/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.data?.message || 'Có lỗi xảy ra khi xác nhận giao hàng');
    } catch (error) {
      console.error('Error in confirmDelivery:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 404:
            throw new Error(data.message || 'Không tìm thấy đơn hàng');
          case 400:
            throw new Error(data.message || 'Đơn hàng không ở trạng thái phù hợp');
          case 500:
            throw new Error(data.message || 'Lỗi server khi xử lý giao hàng');
          default:
            throw new Error(data.message || `Lỗi không xác định: ${status}`);
        }
      }
      
      throw error;
    }
  },
  processVnPayCallback: async (queryString) => {
    try {
        const response = await axiosInstance.get(`${endPoint}/payment-callback${queryString}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return response;
    } catch (error) {
        // Check if this is a redirect error
        if (!error.response && error.message === 'Network Error') {
            // Extract information from the URL that the backend tried to redirect to
            const redirectUrl = error.request?.responseURL;
            
            if (redirectUrl) {
                const url = new URL(redirectUrl);
                const params = new URLSearchParams(url.search);
                
                // Check if this is a payment canceled redirect
                if (url.pathname.includes('/paymentcanceled')) {
                    return {
                        redirectTo: 'paymentcanceled',
                        orderId: params.get('orderId'),
                        message: params.get('message') || 'Bạn đã hủy thanh toán'
                    };
                }
                
                // Check if this is a payment failed redirect
                if (url.pathname.includes('/paymentfailed')) {
                    return {
                        redirectTo: 'paymentfailed',
                        orderId: params.get('orderId'),
                        message: params.get('message') || 'Thanh toán thất bại',
                        code: params.get('code')
                    };
                }
                
                // Check if this is a payment success redirect
                if (url.pathname.includes('/paymentsuccess')) {
                    return {
                        redirectTo: 'paymentsuccess',
                        orderId: params.get('orderId'),
                        paymentId: params.get('paymentId'),
                        message: 'Thanh toán thành công'
                    };
                }
            }
            
            // If we can't determine the redirect type, assume it's a payment failure
            throw new Error('payment_canceled');
        }
        
        // For other types of errors, throw them as before
        if (error.response) {
            throw error;
        } else {
            throw new Error('redirect');
        }
    }
},
  
  processAndConfirmMultiplePayments: async () => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}/ProcessAndConfirmPayment`,
        {},
        {
          timeout: 15000, // Tăng timeout vì xử lý nhiều đơn hàng
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data
        };
      }

      throw new Error(response.data.message || 'Có lỗi xảy ra khi xử lý thanh toán hàng loạt');

    } catch (error) {
      console.error('Error in processAndConfirmMultiplePayments:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            throw new Error(data || 'Không có đơn hàng nào cần xử lý');
          case 500:
            throw new Error(data || 'Lỗi server khi xử lý thanh toán hàng loạt');
          default:
            throw new Error(data || `Lỗi không xác định: ${status}`);
        }
      }

      throw new Error(error.message || 'Không thể kết nối đến server');
    }
  },
  
  startShipping: async (orderId) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}/start-shipping/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          message: response.data.message,
          order: response.data.order
        };
      }

      throw new Error(response.data?.message || 'Có lỗi xảy ra khi bắt đầu giao hàng');

    } catch (error) {
      console.error('Error in startShipping:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 404:
            throw new Error(data.message || 'Không tìm thấy đơn hàng');
          case 400:
            throw new Error(data.message || 'Đơn hàng chưa được thanh toán hoặc không ở trạng thái phù hợp');
          case 500:
            throw new Error(data.message || 'Lỗi server khi xử lý giao hàng');
          default:
            throw new Error(data.message || `Lỗi không xác định: ${status}`);
        }
      }

      throw new Error(error.message || 'Không thể kết nối đến server');
    }
  },
};

export default paymentsAPI;
