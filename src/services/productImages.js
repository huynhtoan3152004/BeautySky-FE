import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/ProductsImages";

const productImagesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  getImageByProductId: async (id, payload) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editproductImages: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteproductImages: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
  uploadproductImages: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axiosInstance.post(
        `${endPoint}/UploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      throw error; // Ném lại để cho phép người gọi xử lý
    }
  }
};

export default productImagesAPI;
