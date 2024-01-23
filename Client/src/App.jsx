import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CoinDetailPage from "./pages/Coin/CoinDetails";
import BuySellPage from "./pages/BuySell";
import Auth from "./pages/Auth/index";
import Footer from "./components/Footer";

function App() {
  const [dataHolder, setDataHolder] = useState();
  const [coinId, setCoinId] = useState("bitcoin");

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        const response = await axios.get("https://api.coincap.io/v2/assets");
        const data = response.data.data;

        setDataHolder(data);
      } catch (error) {
        console.error("Error fetching volume coins:", error);
      }
    };

    fetchCoinsData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavBar coinId={coinId} />}>
          <Route element={<Footer />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/markets"
              element={
                <Markets dataHolder={dataHolder} setCoinId={setCoinId} />
              }
            />
            <Route
              path="/trade/:id"
              element={
                <CoinDetailPage dataHolder={dataHolder} coinId={coinId} />
              }
            />
            <Route path="/crypto/:action" element={<BuySellPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
