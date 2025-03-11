import { Link } from "react-router-dom";
const Unauthorized = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            403 - Unauthorized
          </h1>
          <p className="text-gray-700 mb-6">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
