import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/TV";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import { Helmet } from "react-helmet";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Helmet>
        <title>NotFlix</title>
      </Helmet>
      <Header />
      <Switch>
        <Route path={["/tv", "/tv/tvId"]}>
          <Tv />
        </Route>
        <Route path={[`/search`]}>
          <Search />
        </Route>
        <Route path={["/", "/movies/movieId"]}>
          {/* react-router가 두개의 path에서 같은 컴포넌트를 render 하도록 한다.. */}
          {/* // 코드에서 "/" 경로를 맨 아래에 두는 이유는 리액트 라우터가 먼저 매칭되는 경로를 선택하기 때문에, 다른 경로가 먼저 처리되도록 보장하기 위함. */}
          <Home />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
