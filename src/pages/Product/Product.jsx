import React, { useState, useEffect } from "react";
import { Filter, Star, Sun, Droplet } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useDataContext } from "../../context/DataContext";
import ProductList from "./ProductList";
import Joyride from 'react-joyride';
import Swal from 'sweetalert2';

const ProductsPage = () => {
  const [runTutorial, setRunTutorial] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("asc");
  const { fetchProduct } = useDataContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProduct();
    setCurrentPage(1);
  }, [selectedSkinType, selectedCategory]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const steps = [
    {
      target: '.products-page-container',
      content: 'Chào mừng bạn đến với trang sản phẩm của BeautySky! Tại đây bạn có thể tìm kiếm và mua sắm các sản phẩm skincare phù hợp với nhu cầu của mình.',
      placement: 'center',
      disableBeacon: true,
      spotlightPadding: 20,
      disableOverlayClose: true
    },
    {
      target: '.sidebar-container',
      content: 'Đây là bộ lọc sản phẩm, giúp bạn tìm kiếm sản phẩm phù hợp với nhu cầu của mình. Bạn có thể lọc theo loại da và danh mục sản phẩm.',
      placement: 'right',
      spotlightPadding: 20,
      disableOverlayClose: true
    },
    {
      target: '.skin-type-filter',
      content: 'Lọc sản phẩm theo loại da của bạn. Chọn loại da phù hợp để tìm các sản phẩm chuyên biệt cho da dầu, da khô, da thường, da hỗn hợp hoặc da nhạy cảm.',
      placement: 'right',
      spotlightPadding: 20,
      disableOverlayClose: true
    },
    {
      target: '.category-filter',
      content: 'Lọc sản phẩm theo danh mục. Chọn loại sản phẩm bạn cần như tẩy trang, sữa rửa mặt, toner, serum, kem dưỡng hoặc kem chống nắng.',
      placement: 'right',
      spotlightPadding: 20,
      disableOverlayClose: true
    },
    {
      target: '.sort-button',
      content: 'Sắp xếp sản phẩm theo giá. Bạn có thể chọn sắp xếp từ thấp đến cao hoặc từ cao đến thấp để dễ dàng tìm sản phẩm phù hợp với ngân sách.',
      placement: 'bottom',
      spotlightPadding: 20,
      disableOverlayClose: true
    },
    {
      target: '.product-list-section',
      content: 'Danh sách sản phẩm sẽ hiển thị theo bộ lọc và cách sắp xếp bạn đã chọn. Mỗi sản phẩm sẽ hiển thị hình ảnh, tên, giá và đánh giá từ khách hàng.',
      placement: 'left',
      spotlightPadding: 20,
      disableOverlayClose: true
    }
  ];

  const startTutorial = () => {
    setRunTutorial(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 products-page-container">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:py-12 md:px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 text-center mb-8 md:mb-12 drop-shadow-lg">
          Khám phá Sản Phẩm Skincare
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 max-w-[1440px] mx-auto">
          {/* Sidebar */}
          <div className="w-full lg:w-1/5 p-4 md:p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-gray-100 h-fit lg:sticky lg:top-20 hover:shadow-2xl transition-all duration-300 sidebar-container">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Filter size={20} className="text-blue-500" /> Bộ lọc
            </h2>
            {/* Loại da filter */}
            <div className="mb-6 skin-type-filter">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                <Droplet size={16} className="text-blue-500" /> Loại da
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Tất cả",
                  "Da Dầu",
                  "Da Khô",
                  "Da Thường",
                  "Da Hỗn Hợp",
                  "Da Nhạy Cảm",
                ].map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border ${
                      selectedSkinType === type
                        ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white border-transparent shadow-lg shadow-blue-200 scale-105"
                        : "bg-white hover:bg-blue-50 hover:border-blue-200 border-gray-200"
                    }`}
                    onClick={() => setSelectedSkinType(type)}
                    aria-pressed={selectedSkinType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {/* Loại sản phẩm filter */}
            <div className="mb-4 category-filter">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                <Sun size={16} className="text-yellow-500" /> Loại sản phẩm
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Tất cả",
                  "Tẩy trang",
                  "Sữa rửa mặt",
                  "Toner",
                  "Serum",
                  "Kem Dưỡng",
                  "Kem Chống Nắng",
                ].map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-white border-transparent shadow-lg shadow-yellow-200 scale-105"
                        : "bg-white hover:bg-yellow-50 hover:border-yellow-200 border-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Product List */}
          <div className="w-full lg:w-4/5 product-list-section">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg gap-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                 Sản phẩm nổi bật 
              </h2>
              <button
                className={`w-full md:w-auto px-4 md:px-6 py-2 md:py-3 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 sort-button ${
                  sortOrder === "asc"
                    ? "bg-gradient-to-r from-purple-400 to-pink-400"
                    : "bg-gradient-to-r from-pink-400 to-purple-400"
                } hover:shadow-lg hover:scale-105`}
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <Star size={20} /> Sắp xếp theo{" "}
                {sortOrder === "asc" ? "tăng dần" : "giảm dần"}
              </button>
            </div>
            {/* ProductList */}
            <ProductList
              selectedSkinType={selectedSkinType}
              selectedCategory={selectedCategory}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </main>
      <Footer />

      {/* Tutorial button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={startTutorial}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
        >
          <i className="fas fa-question-circle text-xl group-hover:rotate-12 transition-transform"></i>
          <span className="font-medium">Hướng dẫn sử dụng</span>
        </button>
      </div>

      {/* Joyride configuration */}
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={true}
        disableScrolling={true}
        styles={{
          options: {
            primaryColor: '#3B82F6',
            textColor: '#1F2937',
            backgroundColor: '#FFFFFF',
            arrowColor: '#FFFFFF',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000
          },
          tooltip: {
            borderRadius: '0.75rem',
            padding: '1rem',
            maxWidth: '300px'
          },
          buttonNext: {
            backgroundColor: '#3B82F6',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            color: '#FFFFFF'
          },
          buttonBack: {
            marginRight: '0.75rem',
            color: '#4B5563',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem'
          },
          buttonSkip: {
            color: '#4B5563',
            backgroundColor: 'transparent'
          }
        }}
        locale={{
          back: 'Quay lại',
          close: 'Đóng',
          last: 'Kết thúc',
          next: 'Tiếp tục',
          skip: 'Bỏ qua'
        }}
        callback={(data) => {
          const { status, type } = data;
          if (status === 'finished' || status === 'skipped') {
            setRunTutorial(false);
            if (status === 'finished') {
              Swal.fire({
                icon: 'success',
                title: 'Hoàn thành hướng dẫn!',
                text: 'Bạn đã sẵn sàng để khám phá sản phẩm. Chúc bạn có trải nghiệm tuyệt vời!',
                confirmButtonText: 'Bắt đầu mua sắm'
              });
            }
          }
        }}
      />
    </div>
  );
};

export default ProductsPage;
