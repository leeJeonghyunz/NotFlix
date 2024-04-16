// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/grid";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: cneter;
`;

const Box = styled.div`
  background-color: green;
  height: 200px;
  width: 200px;
`;

const swiperStyle = {
  backgroundColor: "red",
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
};

export default function Practice() {
  return (
    <Wrapper>
      <Swiper
        // install Swiper modules.
        style={swiperStyle}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={6}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper: any) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
          (el) => (
            <SwiperSlide>
              <Box>{el}</Box>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </Wrapper>
  );
}
