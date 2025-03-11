import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Categories";
const categoryApi = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createCategory: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    return response;
  },
  deleteCategory: async (id) => {
    await axiosInstance.delete(`${endPoint}/${id}`);
  },
  editCategory: async (id, payload) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
    return response;
  },
  searchCategory: async (id) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`);
    return response;
  },
};

export default categoryApi;
