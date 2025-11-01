import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/nav-bar";
import Home from "./components/home";
import Animations from "./components/animations";
import About from "./components/about";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animations" element={<Animations />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
