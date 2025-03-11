import React from "react";
import Slider from "react-slick";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";

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

const Products = () => {
  const { products } = useDataContext();

  // Slider settings
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 100,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-14 mb-16">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-12 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-gray-600">
            ✨ Sản phẩm bán chạy nhất dành cho bạn ✨
          </p>
          <h1
            data-aos="fade-up"
            className="text-4xl font-bold text-[#6BBCFE] underline underline-offset-8 decoration-1 decoration-black"
          >
            Dòng sản phẩm
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400 py-4">
            Hãy chăm sóc da cùng Sky Beauty®
          </p>
        </div>

        {/* Slider Section */}
        <div data-aos="fade-up" className="relative max-w-7xl mx-auto">
          {products.length > 0 ? (
            <Slider {...settings} className="pb-4">
              {products.map((data, index) => (
                <div key={data.productId} className="px-2 pb-4">
                  <Link to={`/product/${data.productId}`} className="block">
                    <div
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className="bg-white p-5 shadow-xl hover:shadow-blue-400 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-center cursor-pointer h-full flex flex-col rounded-lg mx-1"
                    >
                      <div className="flex justify-center">
                        <img
                          src={
                            data.productsImages?.[0]?.imageUrl ||
                            "https://via.placeholder.com/200"
                          }
                          alt={data.productName}
                          className="h-[250px] w-[300px] object-contain transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-4 flex flex-col flex-grow rounded-b-xl bg-white p-3">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {data.productName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {data.categoryName}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-auto pt-3">
                          <FaStar className="text-yellow-400 text-lg" />
                          <span className="text-sm font-medium text-gray-700">
                            {data.rating || "5.0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có sản phẩm nào
            </p>
          )}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-14">
          <Link
            to="/product"
            className="text-center bg-gradient-to-r from-[#419fed] to-[#186aadeb] hover:scale-105 duration-300 text-white py-3 px-10 rounded-full shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
