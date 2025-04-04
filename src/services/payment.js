import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
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
           
      // Xử lý dựa trên status và trả về dữ liệu phù hợp
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(response.data || 'Có lỗi xảy ra khi xử lý thanh toán');
      }
    } catch (error) {
      console.error('Error in processAndConfirmPayment:', error);
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(data || `Lỗi: ${status}`);
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
        // Chỉ gọi API nếu cần thiết, ví dụ: để lấy thêm thông tin
        // Trong trường hợp này, có thể chỉ cần phân tích queryString
        return { success: true };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi xử lý callback');
    }
}
};

export default paymentsAPI;
