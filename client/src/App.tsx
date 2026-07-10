import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CollectionPage from "./Pages/CollectionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;