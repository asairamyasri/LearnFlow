import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/layout";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import CollectionPage from "./Pages/CollectionPage";
import Login from "./Pages/login";
import Register from "./Pages/register";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected/Layout Routes */}
        <Route path="/" element={<Layout />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="collections"
            element={<Home />}
          />

          <Route
            path="collection/:id"
            element={<CollectionPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;