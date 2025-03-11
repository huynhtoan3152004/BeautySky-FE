import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Blogs";

const blogsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createBlogs: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  searchBlogs: async (id, payload) => {
    return await axiosInstance.get(`${endPoint}/${id}`, payload);
  },
  editBlogs: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteProduct: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
  getSkinType: async () => {
    return (response = await axiosInstance.get(
      `${endPoint}/by-skin-type/${skinType}`
    ));
  },
  getCategory: async () => {
    return (response = await axiosInstance.get(
      `${endPoint}/by-category/${category}`
    ));
  },
};

export default blogsAPI;
