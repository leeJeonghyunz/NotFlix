import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { IGetMovieDetailResult } from "../../api";
import { IMovieId } from "./MobileRow";
import { match, useHistory } from "react-router-dom";
import { theme } from "../../theme";
import { getTime, getYears, makeImagePath } from "../../utilitis";

const BigMovie = styled(motion.div)<{ isPc?: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  overflow-y: scroll;
  z-index: 10;
`;

const MovieDetailLoading = styled.p`
  color: ${(props) => props.theme.white.darker};
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 36px;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
  z-index: 10;
  display: flex;
`;

const BackBtn = styled.div`
  position: relative;
  top: 70px;
  left: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  text-align: center;
  height: 50px;
  width: 50px;
  font-size: 2rem;
  border-radius: 50%;
  cursor: pointer;
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

interface IMobileBigMovieProp {
  movieDetail: IGetMovieDetailResult | undefined;
  bigMovieMatch: match<IMovieId>;
  genres: any;
  title: string;
}

export default function MobileBigMovie({
  movieDetail,
  bigMovieMatch,
  genres,
  title,
}: IMobileBigMovieProp) {
  const isPc = useMediaQuery({ query: "(min-width: 1024px)" });
  const history = useHistory(); // 리액트에서 URL주소를 변경할 때 사용하는 Hook
  const onClickOverlay = () => history.goBack();

  return (
    <>
      <BigMovie isPc={isPc} layoutId={bigMovieMatch.params.movieId + title}>
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
            >
              <BackBtn onClick={onClickOverlay}>{"<"}</BackBtn>
            </BigCover>
            <BigMovieBottom>
              <InFoWrapper>
                <BigTitle>
                  <div>{movieDetail.title}</div>
                  <OriginalTitle>{movieDetail?.original_title}</OriginalTitle>
                </BigTitle>
                <SmallInfo>
                  {" "}
                  <div>{getYears(movieDetail.release_date)} </div>
                </SmallInfo>
                <Runtime>{getTime(movieDetail?.runtime as number)}</Runtime>
                <BigOverview>{movieDetail.overview} </BigOverview>
              </InFoWrapper>
            </BigMovieBottom>
            <GenreUl>
              {genres.map((genre: any) => (
                <GenreLi>{genre.name}</GenreLi>
              ))}
            </GenreUl>
          </>
        )}
      </BigMovie>
    </>
  );
}
