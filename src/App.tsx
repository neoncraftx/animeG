import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/home";
import { LogPage } from "./pages/log";
import { MenuAmburger } from "./components/menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/log" element={<LogPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
