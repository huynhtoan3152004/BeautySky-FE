import React from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const TestimonialData = [
  {
    id: 1,
    name: "Toàn",
    text: "Tôi đã mua Serum Dưỡng Da Sky Beauty và rất hài lòng với kết quả! Làn da của tôi sáng hơn và các vết thâm đã mờ đi.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Hải",
    text: "Kem Dưỡng Ban Đêm Sky Beauty thật tuyệt vời! Tôi thức dậy với làn da mềm mại và đủ ẩm. Tôi khuyên mọi người nên dùng!",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Danh",
    text: "Mặt Nạ Làm Sạch Sky Beauty thực sự là cứu tinh cho làn da dầu của tôi. Tôi sử dụng mỗi tuần một lần và lỗ chân lông đã thu nhỏ đáng kể.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Nhi",
    text: "Toner Làm Sạch Sky Beauty giúp da tôi luôn tươi mát và săn chắc. Đây là sản phẩm không thể thiếu trong quy trình chăm sóc da của tôi.",
    img: "https://picsum.photos/103/103",
  },
];

// Custom Next and Previous Buttons
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
  >
    <FaArrowLeft size={20} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
  >
    <FaArrowRight size={20} />
  </button>
);

const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
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
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
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
    <div className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p
          data-aos="fade-up"
          className="text-sm text-gray-700 uppercase tracking-wide"
        >
          Khách hàng của chúng tôi nói gì
        </p>
        <h1 data-aos="fade-up" className="text-4xl font-bold text-[#6BBCFE]">
          Đánh giá từ khách hàng
        </h1>
        <p data-aos="fade-up" className="text-md text-gray-600 mt-2">
          Những trải nghiệm thực tế từ những khách hàng yêu thích sản phẩm của
          chúng tôi.
        </p>
      </div>

      {/* Testimonial Slider */}
      <div data-aos="zoom-in" className="relative max-w-6xl mx-auto">
        <Slider {...settings}>
          {TestimonialData.map((data) => (
            <div key={data.id} className="px-4">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6 mx-2 relative hover:shadow-2xl transition-all duration-300">
                <FaQuoteLeft className="text-blue-300 text-5xl absolute top-4 left-4 opacity-20" />

                {/* User Image */}
                <img
                  src={data.img}
                  alt={data.name}
                  className="rounded-full w-20 h-20 border-4 border-blue-300 shadow-md mb-4"
                />

                {/* Testimonial Content */}
                <p className="text-gray-600 italic text-center text-sm leading-relaxed">
                  "{data.text}"
                </p>

                {/* User Name */}
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {data.name}
                </h2>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;

// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useReviewContext } from "../../context/ReviewContext";

// // Custom Next and Previous Buttons
// const CustomPrevArrow = (props) => (
//   <button
//     {...props}
//     className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
//   >
//     <FaArrowLeft size={20} />
//   </button>
// );

// const CustomNextArrow = (props) => (
//   <button
//     {...props}
//     className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
//   >
//     <FaArrowRight size={20} />
//   </button>
// );

// const Testimonials = () => {
//   const { reviews, fetchReviews } = useReviewContext();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadReviews = async () => {
//       await fetchReviews();
//       setLoading(false);
//     };
//     loadReviews();
//   }, []);

//   const settings = {
//     dots: true,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     cssEase: "linear",
//     pauseOnHover: true,
//     pauseOnFocus: true,
//     nextArrow: <CustomNextArrow />,
//     prevArrow: <CustomPrevArrow />,
//     responsive: [
//       { breakpoint: 10000, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//       { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//       { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
//     ],
//   };

//   return (
//     <div className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
//       {/* Header Section */}
//       <div className="text-center mb-12 max-w-2xl mx-auto">
//         <p className="text-sm text-gray-700 uppercase tracking-wide">
//           Khách hàng của chúng tôi nói gì
//         </p>
//         <h1 className="text-4xl font-bold text-[#6BBCFE]">
//           Đánh giá từ khách hàng
//         </h1>
//         <p className="text-md text-gray-600 mt-2">
//           Những trải nghiệm thực tế từ những khách hàng yêu thích sản phẩm của
//           chúng tôi.
//         </p>
//       </div>

//       {/* Testimonial Slider */}
//       <div className="relative max-w-6xl mx-auto">
//         {loading ? (
//           <p className="text-center text-gray-500">Đang tải đánh giá...</p>
//         ) : reviews.length === 0 ? (
//           <p className="text-center text-gray-500">Chưa có đánh giá nào</p>
//         ) : (
//           <Slider {...settings}>
//             {reviews.map((review) => (
//               <div key={review.id} className="px-4">
//                 <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6 mx-2 relative hover:shadow-2xl transition-all duration-300">
//                   <FaQuoteLeft className="text-blue-300 text-5xl absolute top-4 left-4 opacity-20" />

//                   {/* User Image */}
//                   <img
//                     src={review.image || "https://via.placeholder.com/100"}
//                     alt={review.name}
//                     className="rounded-full w-20 h-20 border-4 border-blue-300 shadow-md mb-4 object-cover"
//                   />

//                   {/* Testimonial Content */}
//                   <p className="text-gray-600 italic text-center text-sm leading-relaxed">
//                     "{review.comment}"
//                   </p>

//                   {/* User Name */}
//                   <h2 className="mt-4 text-lg font-semibold text-gray-900">
//                     {review.name}
//                   </h2>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Testimonials;
