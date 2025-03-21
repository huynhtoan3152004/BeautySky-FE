import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
  getAllPaymentDetails: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/AllDetails`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thanh toán:", error);
      throw error;
    }
  },
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/Details/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thanh toán:", error);
      throw error;
    }
  },
  processAndConfirmPayment: async (orderId) => {
    if (!orderId) {
      throw new Error('OrderId là bắt buộc');
    }

    try {
      const response = await axiosInstance.post(
        `${endPoint}/ProcessAndConfirmPayment/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Kiểm tra response status cụ thể hơn
      switch (response.status) {
        case 201:
          return {
            success: true,
            data: response.data,
            message: 'Thanh toán đã được xử lý thành công'
          };
        case 404:
          throw new Error('Không tìm thấy đơn hàng');
        case 400:
          throw new Error(response.data || 'Đơn hàng không hợp lệ');
        default:
          throw new Error('Có lỗi xảy ra khi xử lý thanh toán');
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            throw new Error('Không tìm thấy đơn hàng');
          case 400:
            throw new Error(data || 'Đơn hàng không hợp lệ');
          case 500:
            throw new Error('Lỗi hệ thống, vui lòng thử lại sau');
          default:
            throw new Error(data?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        }
      }
      if (error.request) {
        throw new Error('Lỗi kết nối, vui lòng thử lại sau');
      }
      throw error;
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
  createVNPayUrl: async (paymentInfo) => {
    try {
      const response = await axiosInstance.post(`${endPoint}`, paymentInfo);
      return response.data;
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
      throw error;
    }
  },
  handleVNPayCallback: async (queryParams) => {
    try {
      const response = await axiosInstance.get(`${endPoint}`, {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error("Error handling VNPay callback:", error);
      throw error;
    }
  },
  createConfirmPayment: async (paymentId, payload) => {
    const response = await axiosInstance.post(`${endPoint}/ConfirmPayment/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  createProcessPayment: async (paymentId, payload) => {
    const response = await axiosInstance.post(`${endPoint}/ProcessPayment/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  getPaymentsById: async (paymentId, payload) => {
    const response = await axiosInstance.get(`${endPoint}/Details/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  processPayment: async (orderId) => {
    const response = await axiosInstance.post(`${endPoint}/ProcessPayment/${orderId}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
  },
  confirmPayment: async (paymentId) => {
    const response = await axiosInstance.post(`${endPoint}/ConfirmPayment/${paymentId}`, {});
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
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
        const response = await axiosInstance.get(
            `${endPoint}/payment-callback?${queryString}`
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi xử lý callback');
    }
}
};

export default paymentsAPI;
