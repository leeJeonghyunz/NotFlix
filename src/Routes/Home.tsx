import { useQuery } from "@tanstack/react-query";
import {
  IGetMovieResult,
  getMovie,
  getTopRated,
  getUpcomingMovie,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utilitis";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { SliderFn } from "../Components/Slider";
import { useMediaQuery } from "react-responsive";
import { theme } from "../theme";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const MobileBanner = styled.div<{ bgphoto: string }>`
  z-index: -2;
  height: 100vh;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  filter: blur(15px);
`;

const MobileBannerDiv = styled.div`
  position: absolute;
  width: 85%;
  height: 60%;
  top: calc(15%);
  left: calc(8%);
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  border-radius: 20px;
  border: 2px double ${(props) => props.theme.white.darker};
`;

const MobileBannerTitle = styled.div`
  font-size: 3rem;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const SVG = styled.svg<{ isMobile?: boolean }>`
  width: ${(props) => (props.isMobile ? "16px" : "32px")};
  height: ${(props) => (props.isMobile ? "16px" : "32px")};
  margin-right: 5px;
`;

const ViewDetail = styled(motion.div)<{ isMobile?: boolean }>`
  background-color: rgba(128, 128, 128, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.isMobile ? "16px" : "32px")};
  width: ${(props) => (props.isMobile ? "150px" : "220px")};
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
`;

function Home() {
  const isPc = useMediaQuery({ query: "(min-width: 1024px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px)" });
  const isMobile = !isPc && !isTablet;

  const history = useHistory(); // 리액트에서 URL주소를 변경할 때 사용하는 Hook

  const { data, isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovie,
  });

  const { data: topRate, isLoading: topRateLoading } =
    useQuery<IGetMovieResult>({
      queryKey: ["movies", "topRated"],
      queryFn: getTopRated,
    });

  const { data: upcoming, isLoading: upcomingLoading } =
    useQuery<IGetMovieResult>({
      queryKey: ["movies", "upcomingMovie"],
      queryFn: getUpcomingMovie,
    });

  const onClickedBox = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const dataaa = data?.results[0].poster_path ?? "";

  return (
    <Wrapper>
      {" "}
      {isLoading ? (
        <Loader> Loading... </Loader>
      ) : (
        <>
          {!isMobile ? (
            <Banner
              bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              {/* 컴포넌트에 백그라운드 이미지 보내기 */}
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
              <ViewDetail
                layoutId={data?.results[0].id + ""}
                onClick={() => onClickedBox(data?.results[0].id as number)}
              >
                <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="white"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                  />
                </SVG>
                상세정보
              </ViewDetail>
            </Banner>
          ) : (
            <>
              <MobileBanner
                bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
              ></MobileBanner>
              <MobileBannerDiv
                style={{
                  backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                    dataaa,
                    "w500"
                  )})`,
                }}
              >
                <MobileBannerTitle>
                  {data?.results[0].title || ""}
                </MobileBannerTitle>
                <ViewDetail
                  isMobile={isMobile}
                  layoutId={data?.results[0].id + ""}
                  onClick={() => onClickedBox(data?.results[0].id as number)}
                >
                  <SVG
                    isMobile={isMobile}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="white"
                      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                    />
                  </SVG>
                  상세정보
                </ViewDetail>
              </MobileBannerDiv>
            </>
          )}
          <SliderFn data={data} isLoading={isLoading} title="Now Playing" />
          <SliderFn
            data={upcoming}
            isLoading={upcomingLoading}
            title="Upcoming"
            viewZero="viewZero"
          />
          <SliderFn
            data={topRate}
            isLoading={topRateLoading}
            title="Top Rated"
            viewZero="viewZero"
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
