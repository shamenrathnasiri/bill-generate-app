import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Bills from "./pages/Bills";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bills" element={<Bills />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;