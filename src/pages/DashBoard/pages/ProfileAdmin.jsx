import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useUsersContext } from "../../../context/UserContext";

const { Title } = Typography;

const ProfileForm = ({ onFinish }) => {
  const { user: authUser } = useAuth(); // Lấy thông tin user đăng nhập
  const { users, fetchUsers } = useUsersContext(); // Lấy danh sách users từ API
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers(); // Gọi API để cập nhật danh sách users
  }, []);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find((u) => u.email === authUser.email); // Tìm user dựa trên email
      setCurrentUser(foundUser || null);
    }
  }, [authUser, users]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (!currentUser) {
    return <p className="text-center text-gray-500">Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Title level={3} className="text-center text-gray-700">
        Thông tin cá nhân
      </Title>
      <Card className="shadow-md rounded-lg p-6 border border-gray-200">
        {!isEditing ? (
          <div className="text-gray-700 space-y-4 p-4 rounded-lg shadow-lg bg-gray-100 border border-gray-300">
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Tên tài khoản: </strong>
              {currentUser.userName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Tên người dùng:</strong>
              {currentUser.fullName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Email:</strong>
              {currentUser.email}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Địa chỉ:</strong>
              {currentUser.address}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Số điện thoại:</strong>
              {currentUser.phone}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Trạng thái:</strong>
              <span
                className={`font-semibold ${
                  currentUser.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            </p>
            <Button
              type="primary"
              onClick={handleEditClick}
              className="bg-[#6BBCFE] hover:bg-[#0272cd] transition-all text-lg font-semibold px-10 py-5 rounded-lg mt-4 mb-10 shadow-md"
            >
              Chỉnh sửa
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={currentUser}
            onFinish={onFinish}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Tên tài khoản
                  </span>
                }
                name="userName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                ]}
              >
                <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Tên người dùng
                  </span>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người dùng!" },
                ]}
              >
                <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Địa chỉ</span>}
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Số điện thoại</span>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={handleCancelClick}
                className="border-gray-400 px-6 py-2 text-gray-600 hover:bg-gray-200 transition-all rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#6BBCFE] hover:bg-[#0272cd] text-white px-6 py-2 font-semibold rounded-lg transition-all shadow-md"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfileForm;
