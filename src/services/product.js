import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Products";

const productApi = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`);
    return response;
  },
  
  createProduct: async (formData) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error.message);
      throw error;
    }
  },
  
  editProduct: async (id, formData) => {
    try {
      const response = await axiosInstance.put(
        `${endPoint}/${id}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      throw error;
    }
  },
  
  uploadImage: async (formData) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default productApi;