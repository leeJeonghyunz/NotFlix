import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { IGetMovieDetailResult, IMovie, getMovieDetails } from "../api";
import { getTime, getYears, makeImagePath } from "../utilitis";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { theme } from "../theme";
import noImage from "../img/noImage.jpg";
import { useMediaQuery } from "react-responsive";
import MobileRow from "./reactive/MobileRow";
import MobileBigMovie from "./reactive/MobileBigMovie";

const Wrapper = styled.div<{ isPc: boolean }>`
  margin-bottom: ${(props) => (props.isPc ? "250px" : "100px")};
`;

const Title = styled.h2<{ isPc: boolean }>`
  color: ${(props) => props.theme.white.darker};
  position: relative;
  top: ${(props) => (props.isPc ? "-170px" : "-100px")};
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 2rem;
  font-weight: 600;
`;

const Slider = styled.div`
  position: relative;
  top: -50px;
  display: flex;
  align-items: center;
`;

const ArrowBox = styled.div<{ arrowBoxHover: boolean }>`
  position: absolute;
  font-size: 30px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1;
  width: 100%;
  opacity: ${(props) => (props.arrowBoxHover ? 1 : 0)};
`;

const SVG = styled(motion.svg)<{ arrowHover: boolean }>`
  width: 60px;
  height: 60px;
  path {
    fill: ${(props) =>
      props.arrowHover ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5 )"};
    stroke-width: 10;
    cursor: pointer;
  }
`;

const Path = styled(motion.path)``;

const Row = styled(motion.div)<{ isMobile: boolean; isPc: boolean }>`
  display: grid;
  gap: 5px;
  grid-template-columns: ${(props) =>
    props.isMobile
      ? " repeat(3, 1fr)"
      : props.isPc
      ? "repeat(6, 1fr)"
      : "repeat(4,1fr)"};
  position: absolute;
  width: 100%;
`;

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

const rowVariant = {
  hidden: {
    x: window.outerWidth + 5, // window의 넓이를 구하는 함수.
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5, // window의 넓이를 구하는 함수.
  },
};

const rowReverseVariant = {
  hidden: {
    x: -window.outerWidth - 5, // window의 넓이를 구하는 함수.
  },
  visible: {
    x: 0,
  },
  exit: {
    x: +window.outerWidth + 5, // window의 넓이를 구하는 함수.
  },
};

const boxVariant = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const infoVariant = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const pathVariant = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {},
  },
};

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 3;
`;

const MovieDetailLoading = styled.p`
  color: ${(props) => props.theme.white.darker};
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 36px;
`;

const BigMovie = styled(motion.div)<{ isPc?: boolean }>`
  position: fixed;
  width: ${(props) => (props.isPc ? "45vw" : "100%")};
  height: ${(props) => (props.isPc ? "80vh" : "100%")};
  top: ${(props) => (!props.isPc ? "0" : "100px")};
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  overflow-y: scroll;
  z-index: 10;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
  z-index: 10;
  display: flex;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
  padding-left: 20px;
`;

const OriginalTitle = styled.div`
  display: flex;
  font-size: 24px;
  padding-left: 10px;
  align-items: center;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`;

const SmallInfo = styled.div`
  display: flex;
  position: relative;
  top: -80px;
  padding: 20px 30px;
`;

const Runtime = styled.div`
  position: relative;
  top: -80px;
  padding: 0 30px;
`;

const BigMovieBottom = styled.div`
  padding: 20px;
  display: flex;
`;

const Poster = styled.img`
  position: relative;
  top: -150px;
`;

const InFoWrapper = styled.div`
  position: relative;
  top: -50px;
`;

const GenreUl = styled.ul`
  list-style: disc;
  display: flex;
  padding: 20px;
`;

const GenreLi = styled.li`
  margin-left: 30px;
`;

export interface IMovieId {
  movieId: string;
}

interface ISliderFnProps {
  data: any;
  isLoading: boolean;
  title: string;
  keyword?: string;
  search?: string;
  viewZero?: string;
}

export function SliderFn({
  data,
  isLoading,
  title,
  search,
  viewZero,
}: ISliderFnProps) {
  const isPc = useMediaQuery({ query: "(min-width: 1024px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px)" });
  const isMobile = !isPc && !isTablet;

  const searchFalse = "/movies/:movieId";
  const searchTrue = "/search/movies/:movieId";

  const bigMovieMatch = useRouteMatch<IMovieId>(
    search ? searchTrue : searchFalse
  );

  const [arrowBoxHover, setArrowBoxHover] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);
  const [leaving, setLeaving] = useState(false); // 중복 클릭을 방지.
  const [reverse, setReverse] = useState(false);

  const [index, setIndex] = useState(0);
  const history = useHistory(); // 리액트에서 URL주소를 변경할 때 사용하는 Hook
  const offset = isMobile ? 3 : isPc ? 6 : 4;

  const movieId = bigMovieMatch?.params.movieId ?? "";
  const { data: movieDetail } = useQuery<IGetMovieDetailResult>({
    queryKey: ["movies", movieId],
    queryFn: () => getMovieDetails(movieId),
  });

  const onClickedBox = (movieId: number) => {
    if (search) {
      history.push(`${search}/movies/${movieId}`);
    } else {
      history.push(`/movies/${movieId}`);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onClickIncreaseIndex = () => {
    setReverse(false);
    if (data) {
      const totalMovies = viewZero
        ? data.results.length
        : data.results.length - 1;
      const maxMovies = Math.ceil(totalMovies / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setIndex((prev) => (prev === maxMovies ? 0 : prev + 1));
    }
  };

  const onClickDecreaseIndex = () => {
    setReverse(true);
    if (data) {
      const totalMovies = data?.results.length - 1;
      const maxMovies = Math.ceil(totalMovies / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setIndex((prev) => (prev === 0 ? maxMovies : prev - 1));
    }
  };

  const onClickOverlay = () => history.goBack();

  const genres = movieDetail?.genres || [];

  return (
    <>
      {" "}
      <Wrapper isPc={isPc}>
        <Title isPc={isPc}>{title}</Title>
        <Slider
          onMouseEnter={() => setArrowBoxHover(true)}
          onMouseLeave={() => setArrowBoxHover(false)}
        >
          <ArrowBox arrowBoxHover={arrowBoxHover}>
            <SVG
              onClick={onClickDecreaseIndex}
              variants={pathVariant}
              initial="initial"
              whileHover="hover"
              arrowHover={arrowHover}
              onMouseEnter={() => {
                setArrowHover(true);
                setReverse(true);
              }}
              onMouseLeave={() => setArrowHover(false)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <Path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
            </SVG>
            <SVG
              onClick={onClickIncreaseIndex}
              transition={{ type: "tween", duration: 1 }}
              variants={pathVariant}
              initial="initial"
              whileHover="hover"
              arrowHover={arrowHover}
              onMouseEnter={() => {
                setArrowHover(true);
                setReverse(false);
              }}
              onMouseLeave={() => setArrowHover(false)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <Path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
            </SVG>
          </ArrowBox>
          {isPc && (
            <AnimatePresence
              initial={false}
              onExitComplete={() => {
                toggleLeaving();
              }}
            >
              <Row
                isPc={isPc}
                isMobile={isMobile}
                variants={reverse ? rowReverseVariant : rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(viewZero ? 0 : 1)
                  .slice(offset * index, offset + offset * index)
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={movie.id + "" + title}
                      transition={{ type: "tween" }}
                      variants={boxVariant}
                      whileHover="hover"
                      initial="normal"
                      key={movie.id}
                      onClick={() => onClickedBox(movie.id)}
                      bgphoto={
                        movie.backdrop_path
                          ? makeImagePath(movie.backdrop_path, "w400")
                          : noImage
                      }
                    >
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          )}
          <>
            {!isPc && (
              <MobileRow data={data} title={title} isLoading={isLoading} />
            )}
          </>
          <AnimatePresence>
            {isPc && bigMovieMatch && (
              <>
                <Overlay
                  onClick={onClickOverlay}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  isPc={isPc}
                  layoutId={bigMovieMatch.params.movieId + title}
                >
                  {!movieDetail ? (
                    <MovieDetailLoading>Loading~~~</MovieDetailLoading>
                  ) : (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, ${
                            theme.black.lighter
                          }, transparent), url(${makeImagePath(
                            movieDetail.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigMovieBottom>
                        <Poster
                          alt=""
                          src={makeImagePath(movieDetail.poster_path, "w200")}
                        />
                        <InFoWrapper>
                          <BigTitle>
                            <div>{movieDetail.title}</div>
                            <OriginalTitle>
                              {movieDetail?.original_title}
                            </OriginalTitle>
                          </BigTitle>
                          <SmallInfo>
                            {" "}
                            <div>{getYears(movieDetail.release_date)} </div>
                          </SmallInfo>
                          <Runtime>
                            {getTime(movieDetail?.runtime as number)}
                          </Runtime>
                          <BigOverview>{movieDetail.overview} </BigOverview>
                        </InFoWrapper>
                      </BigMovieBottom>
                      <GenreUl>
                        {genres.map((genre) => (
                          <GenreLi>{genre.name}</GenreLi>
                        ))}
                      </GenreUl>
                    </>
                  )}
                </BigMovie>
              </>
            )}
            {!isPc && bigMovieMatch && (
              <MobileBigMovie
                movieDetail={movieDetail}
                bigMovieMatch={bigMovieMatch}
                genres={genres}
                title={title}
              />
            )}
          </AnimatePresence>
        </Slider>
      </Wrapper>
    </>
  );
}
