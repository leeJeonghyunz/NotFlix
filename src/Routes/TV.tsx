import { useQuery } from "@tanstack/react-query";
import { IGetTv, IGetTvTop, getTv, getTvPopular, getTvTopRated } from "../api";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utilitis";
import { useHistory } from "react-router-dom";
import { TvSlider } from "../Components/TvSlider";

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

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const SVG = styled.svg`
  width: 32px;
  height: 32px;
  margin-right: 5px;
`;

const ViewDetail = styled(motion.div)`
  background-color: rgba(128, 128, 128, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  width: 220px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
`;

function Tv() {
  const history = useHistory();
  const { data, isLoading } = useQuery<IGetTv>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getTv,
  });
  const { data: tvTop, isLoading: tvTopLoading } = useQuery<IGetTvTop>({
    queryKey: ["movies", "TopRatedTv"],
    queryFn: getTvTopRated,
  });

  const { data: tvPopular, isLoading: tvPopularLoading } = useQuery<IGetTvTop>({
    queryKey: ["movies", "PopularTv"],
    queryFn: getTvPopular,
  });

  console.log(tvPopular);

  const onClickedBox = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  return (
    <>
      <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        {/* 컴포넌트에 백그라운드 이미지 보내기 */}
        <Title>{data?.results[0].name}</Title>
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
      <TvSlider data={data} isLoading={isLoading} title="Trending Tv" />
      <TvSlider
        data={tvTop}
        isLoading={tvTopLoading}
        title="Top Rated Tv "
        viewZero="viewZero"
      />
      <TvSlider
        data={tvPopular}
        isLoading={tvPopularLoading}
        viewZero="viewZero"
        title="Popular Tv Shows"
      />
    </>
  );
}

export default Tv;
