import { createContext, useEffect, useState, useContext } from "react";
import productApi from "../services/product";
import skinTypeApi from "../services/skintype";
import categoryApi from "../services/category";
import productImagesAPI from "../services/productImages";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);

  // Thêm log sau khi fetch categories
const fetchCategories = async () => {
  try {
    const response = await categoryApi.getAll();
    console.log('Categories from API:', response.data);
    setCategories(response.data);
  } catch (error) {
    console.error("Error fetching category data:", error);
  }
};

// Tương tự với skinTypes
const fetchSkinTypes = async () => {
  try {
    const response = await skinTypeApi.getAll();
    console.log('Skin types from API:', response.data);
    setSkinTypes(response.data);
  } catch (error) {
    console.error("Error fetching skin type data:", error);
  }
};


  const fetchProductImages = async () => {
    try {
      const response = await productImagesAPI.getAll();
      setProductImages(response.data);
    } catch (error) {
      console.error("Error fetching productImages data:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productApi.getAll();
      const productsData = response.data;
      
      // Trước tiên, đảm bảo rằng categories và skinTypes đã có dữ liệu
      if (categories.length === 0) await fetchCategories();
      if (skinTypes.length === 0) await fetchSkinTypes();
      if (productImages.length === 0) await fetchProductImages();
      
      // Map đầy đủ thông tin từ categories và skinTypes
      const updatedProducts = productsData.map((product) => {
        // Tìm category tương ứng
        const category = categories.find(c => c.categoryId === product.categoryId);
        
        // Tìm skinType tương ứng
        const skinType = skinTypes.find(s => s.skinTypeId === product.skinTypeId);
        
        // Tìm images cho sản phẩm
        const productsImages = productImages.filter(
          (img) => img.productId === product.productId
        );
        
        // Trả về sản phẩm với đầy đủ thông tin
        return { 
          ...product, 
          category: category || null,
          skinType: skinType || null,
          productsImages: productsImages || []
        };
      });
      
      setProducts(updatedProducts);
      console.log('Updated products with full info:', updatedProducts);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const uploadProductImage = async (file, productId) => {
    try {
      const imageUrl = await productImagesAPI.uploadproductImages(file);
      if (imageUrl) {
        // Save uploaded image to the backend (if needed)
        await productImagesAPI.editproductImages(productId, { imageUrl });
        
        // Refresh product images
        await fetchProductImages();
        await fetchProduct();
      }
      return imageUrl;
    } catch (error) {
      console.error("Error uploading product image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch theo thứ tự để đảm bảo dữ liệu phụ thuộc được load trước
        await fetchSkinTypes();
        await fetchCategories();
        await fetchProductImages();
        // Fetch products sau cùng khi đã có đủ dữ liệu liên quan
        await fetchProduct();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    fetchAllData();
  }, []); // Chỉ chạy một lần khi component mount


  return (
    <DataContext.Provider
      value={{
        products,
        skinTypes,
        categories,
        productImages,
        setProducts,
        setProductImages,
        fetchProductImages,
        fetchProduct,
        uploadProductImage,
        fetchSkinTypes,
        fetchCategories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useDataContext = () => useContext(DataContext);

export { DataProvider, useDataContext };