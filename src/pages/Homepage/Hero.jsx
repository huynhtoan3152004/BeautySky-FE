import React, { useEffect, useState } from "react";
import { useNewsContext } from "../../context/EvenContext";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
  >
    <FaArrowLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
  >
    <FaArrowRight size={24} />
  </button>
);

const Hero = () => {
  const { news, fetchNews } = useNewsContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      await fetchNews();
      setLoading(false);
    };
    loadEvents();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative overflow-hidden min-h-[500px] flex justify-center items-center w-full">
      <div className="w-full">
        {loading ? (
          <p className="text-center text-white">Đang tải sự kiện...</p>
        ) : (
          <Slider {...settings} className="w-full">
            {news.map((event) => (
              <div key={event.id} className="relative w-full h-[600px]">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                    {event.title}
                  </h1>
                  <p className="text-lg max-w-2xl mb-6">{event.content}</p>
                  <Link
                    to="/product"
                    className="bg-gradient-to-r from-[#6BBCFE] to-[#97caf4eb] hover:scale-105 duration-200 text-white py-3 px-6 rounded-full text-lg font-semibold mt-6"
                  >
                    Đặt hàng ngay
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Hero;
