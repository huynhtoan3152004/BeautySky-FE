import React from "react";
import Slider from "react-slick";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";

// Custom navigation arrows
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md z-10"
  >
    <FaArrowLeft size={20} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md z-10"
  >
    <FaArrowRight size={20} />
  </button>
);

const TopProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useDataContext();

  // Slider settings
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 200,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="container py-20">
        <div className="text-center max-w-[800px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-black">
            Sản phẩm được đánh giá cao nhất dành cho bạn
          </p>
          <h1
            data-aos="fade-up"
            className="text-center text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]"
          >
            Sản phẩm tốt nhất
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400 py-4">
            Tìm sản phẩm yêu thích của bạn từ Sky Beauty®
          </p>
        </div>

        {/* Slider Section */}
        <div data-aos="fade-up" className="relative max-w-7xl mx-auto">
          {products.length > 0 ? (
            <Slider {...settings} className="pb-4">
              {products.map((product) => (
                <div key={product.productId} className="px-3 pb-4 pt-1">
                  <div
                    data-aos="zoom-in"
                    className="rounded-xl bg-white dark:bg-gray-300 dark:hover:bg-[#6BBCFE] relative shadow-lg shadow-blue-400 duration-300 group h-[420px] p-3 mx-2 mt-10 flex flex-col"
                  >
                    {/* Hot badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Hot
                      </span>
                    </div>

                    {/* Image container - Positioned to float above the card */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[150px] cursor-pointer z-20 mt-6"
                      onClick={() => navigate(`/product/${product.productId}`)}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={
                            product.productsImages?.[0]?.imageUrl ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.productName}
                          className="max-w-[200px] max-h-[150px] object-contain transition-all duration-500 filter"
                        />
                        {/* Add a subtle glow effect on hover */}
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Card content with proper spacing and alignment */}
                    <div className="flex flex-col h-full pt-44 pb-4 px-3 items-center justify-between">
                      {/* Upper content section with calculated space */}
                      <div className="flex flex-col items-center w-full py-4">
                        {/* Rating stars - fixed height */}
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <FaStar className="text-yellow-500" />
                          <FaStar className="text-yellow-500" />
                          <FaStar className="text-yellow-500" />
                          <FaStar className="text-yellow-500" />
                          <FaStar className="text-yellow-500" />
                        </div>

                        {/* Product name - now shows up to 2 lines without truncating */}
                        <div className="w-full text-center mb-1 min-h-[50px] flex items-center justify-center">
                          <h1 className="text-lg font-bold line-clamp-2">
                            {product.productName}
                          </h1>
                        </div>
                        {/* Price - centered with the same width as button */}
                        <div className="w-full text-center mb-2">
                          <p className="font-bold text-sm">
                            {formatCurrency(product.price.toFixed(2))}
                          </p>
                        </div>
                      </div>

                      {/* Button at the bottom with the same width as content above */}
                      <div className="w-full pt-4">
                        <button
                          className="bg-primary hover:scale-105 duration-300 text-black py-2 px-4 rounded-full group-hover:bg-yellow-300 group-hover:text-primary w-full text-sm"
                          onClick={() => addToCart(product)}
                        >
                          Đặt hàng ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có sản phẩm nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
