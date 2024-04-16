import { useQuery } from "@tanstack/react-query";
import { IGetMovieResult, IGetTv, searchMovie, searchTv } from "../api";
import { SliderFn } from "../Components/Slider";
import { TvSlider } from "../Components/TvSlider";
import styled from "styled-components";
import { keywordState } from "../atoms";
import { useRecoilValue } from "recoil";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 200px;
`;

function Search() {
  const keyState = useRecoilValue(keywordState);
  // const keyword = new URLSearchParams(location.search).get("keyword") ?? ""; // URLSearchParams를 이용하여 parameter값을 얻음.

  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMovieResult>({
      queryKey: ["SearchMovie", keyState],
      queryFn: () => searchMovie(keyState),
    });

  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTv>({
    queryKey: ["SearchTv", keyState],
    queryFn: () => searchTv(keyState),
  });

  return (
    <Wrapper>
      <SliderFn
        data={movieData}
        isLoading={movieLoading}
        title="Search: Movie"
        search="/search"
      />
      <TvSlider
        data={tvData}
        isLoading={tvLoading}
        title="Search: TV"
        search="/search"
      />
    </Wrapper>
  );
}

export default Search;
