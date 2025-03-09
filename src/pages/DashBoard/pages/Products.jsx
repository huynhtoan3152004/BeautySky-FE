import React from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useDataContext } from "../../../context/DataContext";
import { Button, Table, Space, Modal, Select } from "antd";
import productApi from "../../../services/product";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import productImagesAPI from "../../../services/productImages";

const Products = () => {
  const { products, skinTypes, categories, setProducts, fetchProduct } =
    useDataContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState("All");
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);
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
    file: null,
  });

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      message.error("Kích thước file không được vượt quá 5MB!");
      onError(new Error("File quá lớn"));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Chỉ cho phép tải lên file ảnh JPG, PNG, GIF!");
      onError(new Error("Định dạng không hợp lệ"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file); // Đảm bảo backend nhận đúng key "image"

      const response = await productImagesAPI.uploadproductImages(formData);

      if (response && response.imageUrl) {
        message.success("Tải ảnh lên thành công!");
        onSuccess({ url: response.imageUrl }); // Trả về URL ảnh
      } else {
        throw new Error("Lỗi khi nhận URL ảnh từ API!");
      }
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
      onError(error);
    }
  };
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
        icon: "error",
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

      if (!editingProduct || !editingProduct.productId) {
        throw new Error("Missing product ID");
      }

      const formData = new FormData();
      formData.append("ProductName", values.productName);
      formData.append("Price", values.price);
      formData.append("Quantity", values.quantity);
      formData.append("Description", values.description);
      formData.append("Ingredient", values.ingredient);
      formData.append("CategoryId", values.categoryId);
      formData.append("SkinTypeId", values.skinTypeId);

      if (values.file) {
        formData.append("File", values.file);
      }

      const response = await productApi.editProduct(
        editingProduct.productId,
        formData
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

      const formData = new FormData();
      formData.append("ProductName", values.productName);
      formData.append("Price", values.price);
      formData.append("Quantity", values.quantity);
      formData.append("Description", values.description);
      formData.append("Ingredient", values.ingredient);
      formData.append("CategoryId", values.categoryId);
      formData.append("SkinTypeId", values.skinTypeId);

      if (values.file) {
        formData.append("File", values.file);
      }

      const response = await productApi.createProduct(formData);

      if (
        response &&
        ((response.status >= 200 && response.status < 300) ||
          response.productId)
      ) {
        const newProductData = response.data || response;
        setProducts((prev) => [...prev, newProductData]);
        setShowAddModal(false);
        setNewProduct({
          productId: 0,
          productName: "",
          price: 0,
          quantity: 1000,
          description: "",
          ingredient: "",
          categoryId: 0,
          skinTypeId: 0,
          file: null,
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
        throw new Error("Add failed");
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
        render: (text) => (
          <span className="font-medium text-gray-800">{text}</span>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => (
          <span className="font-medium text-indigo-600">
            {formatCurrency(price)}
          </span>
        ),
        sorter: (a, b) => a.price - b.price,
        sortOrder,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity) => (
          <span className="font-semibold text-gray-700">{quantity}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "quantity",
        key: "status",
        render: (quantity) =>
          quantity > 0 ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Còn hàng
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
              Hết hàng
            </span>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
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
          Tổng số:{" "}
          <span className="text-indigo-600 font-bold">
            {filteredProducts.length}
          </span>{" "}
          sản phẩm
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
            handleImageUpload={handleImageUpload}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-indigo-800 border-b pb-3">
            + Thêm sản phẩm mới
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
          handleImageUpload={handleImageUpload}
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
            { max: 100, message: "Tên sản phẩm không được vượt quá 100 ký tự" },
          ]}
        />
      </Modal>
    </div>
  );
};

export default Products;
