import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Orders";

const orderAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endPoint);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Bạn không có quyền xem đơn hàng này");
        } else if (error.response.status === 404) {
          throw new Error("Không tìm thấy đơn hàng");
        }
      }
      throw new Error("Có lỗi xảy ra khi lấy thông tin đơn hàng");
    }
  },

  getListOrderUser: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/orders/myOrders`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng của user:", error);
      throw error;
    }
  },

  createOrder: async (promotionID, products) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error("Danh sách sản phẩm không hợp lệ");
      }

      // Format lại products theo đúng model
      const formattedProducts = products.map((item) => ({
        productID: Number(item.productID),
        quantity: Number(item.quantity),
      }));

      // Gửi request với body đúng format
      const response = await axiosInstance.post(
        `${endPoint}/order-products?promotionID=${promotionID || ""}`,
        formattedProducts // Gửi trực tiếp mảng products
      );
      return response.data;
    } catch (error) {
      console.error("Order creation error:", error.response?.data || error);
      if (error.response?.data) {
        // Log chi tiết lỗi từ server
        console.log(
          "Detailed error:",
          JSON.stringify(error.response.data, null, 2)
        );

        // Nếu server trả về message cụ thể, sử dụng message đó
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        } else if (error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error(error.response?.data?.message || "Lỗi khi tạo đơn hàng");
    }
  },
  cancelOrder: async (orderId, cancelReason) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/cancel/${orderId}`, JSON.stringify(cancelReason), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default orderAPI;
