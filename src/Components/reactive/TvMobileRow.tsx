import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../../utilitis";
import noImage from "../../img/noImage.jpg";
import { useHistory } from "react-router-dom";
import { IMovie } from "../../api";
import { useMediaQuery } from "react-responsive";

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.red};
  background-position: center center;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: relative;
  bottom: -160px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

export interface IMovieId {
  movieId: string;
}

interface ISliderFnProps {
  data: any;
  isLoading?: boolean;
  title: string;
  keyword?: string;
  search?: string;
  viewZero?: string;
}

export default function TvMobileRow({ search, data, title }: ISliderFnProps) {
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1024px)",
  });
  const history = useHistory(); // 리액트에서 URL주소를 변경할 때 사용하는 Hook
  const onClickedBox = (movieId: number) => {
    if (search) {
      history.push(`${search}/tv/${movieId}`);
    } else {
      history.push(`/tv/${movieId}`);
    }
  };
  return (
    <Swiper
      // install Swiper modules.
      style={{ width: "90%", display: "flex" }}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      slidesPerView={isTablet ? 4 : 3}
      navigation
      pagination={{ clickable: true }}
      onSwiper={(swiper: any) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
    >
      {data?.results.map((movie: IMovie) => (
        <SwiperSlide>
          <Box
            layoutId={movie.id + "" + title}
            transition={{ type: "tween" }}
            key={movie.id}
            onClick={() => onClickedBox(movie.id)}
            bgphoto={
              movie.poster_path
                ? makeImagePath(movie.poster_path, "w400")
                : noImage
            }
          >
            <Info>
              <h4>{movie.title}</h4>
            </Info>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
