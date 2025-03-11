import React from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useDataContext } from "../../../context/DataContext";
import {
  Button,
  Table,
  Space,
  Modal,
  Input,
  Form,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import productApi from "../../../services/product";
import Swal from "sweetalert2";
const { TextArea } = Input;
import { PlusOutlined } from "@ant-design/icons";
import productImagesAPI from "../../../services/productImages";

const Products = () => {
  const { products, skinTypes, categories, setProducts, fetchProduct } =
    useDataContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState("All");
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const productsPerPage = 5;
  const [newProduct, setNewProduct] = React.useState({
    productId: 0,
    productName: "",
    price: 0,
    quantity: 1000,
    description: "",
    ingredient: "",
    categoryId: 0,
    skinTypeId: 0,
    productsImages: [],
  });

  const handleImageUpload = async (file) => {
    // Tạo đối tượng FormData
    const formData = new FormData();
    formData.append("file", file); // Thêm file vào FormData
  
    try {
      // Gọi API upload ảnh (Sử dụng formData để gửi ảnh)
      const response = await productApi.uploadImage(formData); // Đảm bảo sử dụng formData
  
      // Giả sử server trả về URL của ảnh đã tải lên
      const imageUrl = response.data.imageUrl; // Hoặc cấu trúc phù hợp với API của bạn
      console.log("Ảnh đã được tải lên:", imageUrl);
  
      // Lưu URL này vào state hoặc xử lý theo nhu cầu của bạn
      setNewProduct(prev => [...prev, imageUrl]); // Cập nhật lại state để lưu URL ảnh
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };
  
  


  const [showAddModal, setShowAddModal] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);

  const filteredProducts = React.useMemo(() => {
    let updatedProducts = [...products];

    if (filter !== "All") {
      updatedProducts = updatedProducts.filter((p) =>
        filter === "Còn hàng" ? p.quantity > 0 : p.quantity === 0
      );
    }

    if (sortOrder) {
      updatedProducts.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return updatedProducts;
  }, [products, filter, sortOrder]);

  const displayedProducts = React.useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [currentPage, filteredProducts]
  );
  
  const handleDelete = async (productId) => {
    console.log("Đang xóa với ID:", productId);

    if (!productId) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy ID sản phẩm",
        icon: "error"
      });
      return;
    }

    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await productApi.deleteProduct(productId);
        if (response.status >= 200 && response.status < 300) {
          setProducts((prev) => prev.filter((p) => p.productId !== productId));
          Swal.fire("Xóa thành công!", "Sản phẩm đã được xóa.", "success");
        } else {
          Swal.fire("Lỗi!", "Không thể xóa sản phẩm.", "error");
        }
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa sản phẩm.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async (values) => {
    try {
      setLoading(true);

      // Đảm bảo productId có trong editingProduct
      if (!editingProduct || !editingProduct.productId) {
        throw new Error("Missing product ID");
      }

      const dataToSend = {
        ...values,
        productId: editingProduct.productId,
      };

      console.log("Sending data to API:", dataToSend);

      const response = await productApi.editProduct(
        editingProduct.productId,
        dataToSend
      );

      if (response && response.status >= 200 && response.status < 300) {
        const updatedProduct = response.data || response;
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === editingProduct.productId ? updatedProduct : p
          )
        );
        setShowEditModal(false);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Sản phẩm "${values.productName}" đã được cập nhật thành công!`,
        });
        fetchProduct(response);
      } else {
        throw new Error("Edit failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Cập nhật sản phẩm bị lỗi, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };


  
  const handleAddProduct = async (values) => {
    try {
      setLoading(true);
      console.log("Adding product with values:", values);
      
  
      const formattedImages = values.productsImages
        ? values.productsImages
            .map((img) => ({
              imageUrl: img.imageUrl || img.url || img.response?.url,
            }))
            .filter((img) => img.imageUrl)
        : [];

      
  
      const productData = {
        ...values,
        productsImages: formattedImages,
      };
  
      console.log("Sending product data with images:", productData);
  
      const response = await productApi.createProduct(productData);
  
      if (response && response.status >= 200 && response.status < 300) {
        const newProductData = response.data || response;
  
        setProducts((prev) => [...prev, newProductData]);
        setShowAddModal(false);
        setNewProduct({
          productId: 0,
          productName: "",
          productsImages: [],
          price: 0,
          quantity: 1000,
          description: "",
          ingredient: "",
          categoryId: 0,
          skinTypeId: 0,
        });
  
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `Sản phẩm "${values.productName}" đã được thêm thành công!`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        fetchProduct(response);
      } else {
          // Kiểm tra thông báo lỗi từ API
          if (response.response && response.response.data && response.response.data.message) {
              Swal.fire({
                  icon: "error",
                  title: "Lỗi!",
                  text: response.response.data.message, // Hiển thị thông báo lỗi từ API
                  confirmButtonColor: "#d33",
                  confirmButtonText: "Thử lại",
              });
          } else {
              throw new Error("Add failed");
          }
      }
    } catch (error) {
      console.error("Error adding product:", error);
  
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Lỗi thêm sản phẩm, vui lòng thử lại",
        confirmButtonColor: "#d33",
        confirmButtonText: "Thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        title: "Hình ảnh",
        dataIndex: "productsImages",
        key: "productsImages",
        render: (productsImages) => {
          const imageUrl =
            productsImages?.length > 0
              ? productsImages[0].imageUrl
              : "/placeholder.jpg";
          return (
            <img
              src={imageUrl}
              alt="Product"
              className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
            />
          );
        },
      },
      { 
        title: "Tên", 
        dataIndex: "productName", 
        key: "productName",
        render: (text) => <span className="font-medium text-gray-800">{text}</span>
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => <span className="font-medium text-indigo-600">{formatCurrency(price)}</span>,
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortOrder,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity) => <span className="font-semibold text-gray-700">{quantity}</span>,
      },
      {
        title: "Trạng thái",
        dataIndex: "quantity",
        key: "status",
        render: (quantity) =>
          quantity > 0 ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Còn hàng</span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Hết hàng</span>
          ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                setEditingProduct(record);
                setShowEditModal(true);
              }}
              disabled={loading}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 border-blue-500"
            >
              <FaEdit />
            </Button>
            <Button
              type="danger"
              onClick={() => handleDelete(record.productId)}
              disabled={loading}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 border-red-500 text-white"
            >
              <FaTrash />
            </Button>
          </Space>
        ),
      },
    ],
    [loading, sortOrder]
  );

  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </span>
          Danh sách sản phẩm
        </h1>
        <Button
          type="primary"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 border-0 h-10 px-5 rounded-lg shadow-md"
        >
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="text-gray-700 font-medium">
          Tổng số: <span className="text-indigo-600 font-bold">{filteredProducts.length}</span> sản phẩm
        </div>
        <Space>
          <Select
            className="w-40"
            value={filter}
            onChange={(value) => setFilter(value)}
            options={[
              { value: "All", label: "Tất cả" },
              { value: "Còn hàng", label: "Còn hàng" },
              { value: "Hết hàng", label: "Hết hàng" },
            ]}
            disabled={loading}
          />
          <Select
            className="w-40"
            value={sortOrder || "default"}
            onChange={(value) =>
              setSortOrder(value === "default" ? null : value)
            }
            options={[
              { value: "default", label: "Mặc định" },
              { value: "asc", label: "Giá tăng dần" },
              { value: "desc", label: "Giá giảm dần" },
            ]}
            disabled={loading}
          />
        </Space>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <Table
          columns={columns}
          dataSource={displayedProducts}
          pagination={{
            pageSize: productsPerPage,
            total: filteredProducts.length,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            style: { marginTop: "1rem" },
            className: "bg-gray-50 p-3 rounded-lg",
          }}
          rowKey="productId"
          loading={loading}
          className="border-spacing-y-3"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-gray-800 border-b pb-3">
            Chỉnh sửa sản phẩm
          </div>
        }
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
        width={700}
        bodyStyle={{ padding: 0 }}
        className="rounded-lg overflow-hidden"
      >
        {editingProduct && (
          <ProductForm
            key={editingProduct.productId}
            item={editingProduct}
            onSubmit={handleSaveEdit}
            onCancel={() => setShowEditModal(false)}
            skinTypes={skinTypes}
            categories={categories}
            loading={loading}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-indigo-800 border-b pb-3">
            <span className="text-indigo-600 mr-2">+</span> Thêm sản phẩm mới
          </div>
        }
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={700}
        destroyOnClose={true}
        maskClosable={!loading}
        closable={!loading}
        bodyStyle={{ padding: 0 }}
        className="rounded-lg overflow-hidden"
      >
        <ProductForm
          isAddMode={true}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
          skinTypes={skinTypes}
          categories={categories}
          loading={loading}
          rules={[
            { 
              required: true, 
              message: "Vui lòng nhập tên sản phẩm!" 
            },
            {
              max: 100, 
              message: "Tên sản phẩm không được vượt quá 100 ký tự"
            }
          ]}
        />
      </Modal>
    </div>
  );
};

// Fix the ProductForm component's Upload handling 
const ProductForm = ({
  item,
  onSubmit,
  onCancel,
  skinTypes,
  categories,
  isAddMode = false,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = React.useState([]);

  React.useEffect(() => {
    if (item) {
      // Set initial form values based on the item being edited
      form.setFieldsValue({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
        ingredient: item.ingredient,
        categoryId: item.categoryId,
        skinTypeId: item.skinTypeId,
      });

      // Initialize preview images if editing an existing product
      if (item.productsImages && item.productsImages.length > 0) {
        const formattedImages = item.productsImages.map((img, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: img.imageUrl,
          imageUrl: img.imageUrl,
        }));
        
        form.setFieldsValue({ productsImages: formattedImages });
        setPreviewImages(formattedImages);
      }
    } else {
      // Reset form when no item is provided (for add mode)
      form.resetFields();
      setPreviewImages([]);
    }
  }, [item, form]);

  const onFinish = (values) => {
    // Format the images data to match your API requirements
    const formattedImages = (values.productsImages || []).map(img => ({
      imageUrl: img.imageUrl || img.url || (img.response ? img.response.url : null)
    })).filter(img => img.imageUrl);
    
    // Include productId if in edit mode
    const formData = isAddMode
      ? { ...values, productsImages: formattedImages }
      : { ...values, productId: item?.productId, productsImages: formattedImages };
      
    console.log("Form submission data:", formData);
    onSubmit(formData);
  };

  // Handle file list change
  const handleFileChange = ({ fileList }) => {
    console.log("File list changed:", fileList);
    
    // Update the form with the new file list
    form.setFieldsValue({ productsImages: fileList });
    
    // Update preview images
    setPreviewImages(fileList);
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.Item
          label={<span className="text-gray-700 font-medium">Tên sản phẩm</span>}
          name="productName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input 
            disabled={loading} 
            className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Nhập tên sản phẩm" 
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Giá (VNĐ)</span>}
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber 
                style={{ width: "100%" }} 
                min={0} 
                disabled={loading} 
                className="rounded-lg border-gray-300"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\./g, '')}
                placeholder="100.000"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Số lượng</span>}
              name="quantity"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber 
                style={{ width: "100%" }} 
                min={0} 
                disabled={loading}
                className="rounded-lg border-gray-300"
                placeholder="Nhập số lượng" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Loại sản phẩm</span>}
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
            >
              <Select
                options={categories.map((c) => ({
                  value: c.categoryId,
                  label: c.categoryName,
                }))}
                disabled={loading}
                className="rounded-lg"
                placeholder="Chọn loại sản phẩm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Loại da</span>}
              name="skinTypeId"
              rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
            >
              <Select
                options={skinTypes.map((s) => ({
                  value: s.skinTypeId,
                  label: s.skinTypeName,
                }))}
                disabled={loading}
                className="rounded-lg"
                placeholder="Chọn loại da phù hợp"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          label={<span className="text-gray-700 font-medium">Mô tả</span>} 
          name="description"
        >
          <TextArea 
            rows={4} 
            disabled={loading} 
            className="rounded-lg border-gray-300 resize-none"
            placeholder="Mô tả chi tiết sản phẩm..."
          />
        </Form.Item>

        <Form.Item 
          label={<span className="text-gray-700 font-medium">Thành phần</span>} 
          name="ingredient"
        >
          <TextArea 
            rows={2} 
            disabled={loading} 
            className="rounded-lg border-gray-300"
            placeholder="Liệt kê các thành phần chính..." 
          />
        </Form.Item>
      
        <Form.Item
          label={<span className="text-gray-700 font-medium">Hình ảnh</span>}
          name="productsImages"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
  name="file"
  listType="picture-card"
  fileList={previewImages}
  customRequest={async ({ file, onSuccess, onError }) => {
    try {
      // Tạo FormData cho file
      const formData = new FormData();
      formData.append("file", file);
      
      // Gọi API upload
      const response = await productApi.uploadImage(formData);
      
      if (response.data && response.data.imageUrl) {
        // Giả sử API trả về đường dẫn S3 trong response.data.imageUrl
        const s3Url = response.data.imageUrl;
        console.log("Ảnh đã được tải lên S3:", s3Url);
        
        // Gọi onSuccess với thông tin URL
        onSuccess({ 
          url: s3Url, 
          imageUrl: s3Url,
          name: file.name,
          status: 'done'
        });
      } else {
        throw new Error("API không trả về URL");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      message.error("Không thể tải ảnh lên Amazon S3. Vui lòng thử lại.");
      onError(error);
    }
  }}
  onChange={handleFileChange}
            onPreview={(file) => {
              const preview = file.url || file.thumbUrl;
              const image = new Image();
              image.src = preview;
              const imgWindow = window.open(preview);
              imgWindow.document.write(image.outerHTML);
            }}
            onRemove={(file) => {
              const updatedFileList = previewImages.filter((item) => item.uid !== file.uid);
              setPreviewImages(updatedFileList);
              form.setFieldsValue({ productsImages: updatedFileList });
              
              // Revoke object URL to prevent memory leaks
              if (file.url && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url);
              }
              return true;
            }}
          >
            <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
              <PlusOutlined className="text-xl mb-1" />
              <div className="text-sm">Tải ảnh lên</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Image Upload Status Message */}
        {previewImages.length > 0 && (
          <div className="text-green-500 italic text-sm mb-2">
            Đã tải {previewImages.length} ảnh lên thành công
          </div>
        )}

        <Form.Item className="border-t border-gray-200 pt-4 mb-0 flex justify-end">
          <Space>
            <Button 
              onClick={onCancel} 
              disabled={loading}
              className="text-gray-700 border-gray-300 hover:text-gray-900 hover:border-gray-400"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className={`${isAddMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} border-0`}
            >
              {isAddMode ? "Thêm mới" : "Lưu thay đổi"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Products;