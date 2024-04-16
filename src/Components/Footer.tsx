import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MobileNav = styled.div`
  position: fixed;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 15px;
  bottom: 0px;
  z-index: 60;
`;

const MobileItem = styled.div`
  padding: 5px;
  border: 2px solid ${(props) => props.theme.white.darker};
  border-radius: 15px;
  font-weight: 600;
  width: 70px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
`;

export default function Footer() {
  const isPc = useMediaQuery({ query: "(min-width: 1024px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px)" });
  const isMobile = !isPc && !isTablet;
  return (
    <>
      {isMobile && (
        <MobileNav>
          <Link to="/">
            <MobileItem>Home</MobileItem>
          </Link>
          <Link to="/tv">
            <MobileItem>Tv</MobileItem>
          </Link>
        </MobileNav>
      )}
    </>
  );
}
