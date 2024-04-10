import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { ITV, TvDetails, getTvDetails } from "../api";
import { getYears, makeImagePath } from "../utilitis";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { theme } from "../theme";
import noImage from "../img/noImage.jpg";

const Wrapper = styled.div`
  margin-bottom: 250px;
`;
const Title = styled.h2`
  color: ${(props) => props.theme.white.darker};
  position: relative;
  top: -170px;
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

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
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
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 45vw;
  height: 80vh;
  top: 100px; //  top이 스크롤Y의 위치로 조정, 'MotionValue<number>' and 'number'와 number를 결합시킬 수 없다. 따라서 scrollY.get()사용.
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  overflow-y: scroll;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
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

const MovieDetailLoading = styled.p`
  color: ${(props) => props.theme.white.darker};
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
`;

export interface IMovieId {
  tvId: string;
}

interface ISliderFnProps {
  data: any;
  isLoading: boolean;
  title: string;
  search?: string;
  viewZero?: string;
}

export function TvSlider({ data, title, search, viewZero }: ISliderFnProps) {
  const searchFalse = "/tv/:tvId";
  const searchTrue = "/search/tv/:tvId";

  const bigMovieMatch = useRouteMatch<IMovieId>(
    search ? searchTrue : searchFalse
  );
  const [arrowBoxHover, setArrowBoxHover] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);
  const [leaving, setLeaving] = useState(false); // 중복 클릭을 방지.
  const [reverse, setReverse] = useState(false);

  const [index, setIndex] = useState(0);
  const history = useHistory(); // 리액트에서 URL주소를 변경할 때 사용하는 Hook
  const offset = 6;

  const tvId = bigMovieMatch?.params.tvId ?? "";
  const { data: tvDetail } = useQuery<TvDetails>({
    queryKey: ["tv", tvId],
    queryFn: () => getTvDetails(tvId),
  });

  const onClickedBox = (tvId: number) => {
    if (search) {
      history.push(`/search/tv/${tvId}`);
    } else {
      history.push(`/tv/${tvId}`);
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onClickIncreaseIndex: any = () => {
    setReverse(false);
    if (data) {
      const totalMovies = data?.results.length - 1;
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

  const genres = tvDetail?.genres || [];

  return (
    <>
      <Wrapper>
        <Title>{title}</Title>
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
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              toggleLeaving();
            }}
          >
            <Row
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
                .map((tv: ITV) => (
                  <Box
                    layoutId={tv.id + "" + title}
                    transition={{ type: "tween" }}
                    variants={boxVariant}
                    whileHover="hover"
                    initial="normal"
                    key={tv.id}
                    onClick={() => onClickedBox(tv.id)}
                    bgphoto={
                      tv.backdrop_path
                        ? makeImagePath(tv.backdrop_path, "w400")
                        : noImage
                    }
                  >
                    <Info variants={infoVariant}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <Overlay
                  onClick={onClickOverlay}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie layoutId={bigMovieMatch.params.tvId + title}>
                  {!tvDetail ? (
                    <MovieDetailLoading />
                  ) : (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, ${
                            theme.black.lighter
                          }, transparent), url(${makeImagePath(
                            tvDetail.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigMovieBottom>
                        <Poster
                          alt=""
                          src={makeImagePath(tvDetail.poster_path, "w200")}
                        />
                        <InFoWrapper>
                          <BigTitle>
                            <div>{tvDetail.name}</div>
                            <OriginalTitle>
                              {tvDetail?.original_name}
                            </OriginalTitle>
                          </BigTitle>
                          <SmallInfo>
                            {" "}
                            <div>
                              {getYears(tvDetail?.first_air_date || "")}{" "}
                            </div>
                            <Runtime>
                              {`에피소드 ${
                                tvDetail?.last_episode_to_air
                                  .episode_number as number
                              }개`}
                            </Runtime>
                          </SmallInfo>
                          <BigOverview>{tvDetail.overview} </BigOverview>
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
          </AnimatePresence>
        </Slider>
      </Wrapper>
    </>
  );
}
