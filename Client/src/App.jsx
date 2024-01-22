import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CoinDetailPage from "./pages/Coin/CoinDetails";
import BuySellPage from "./pages/BuySell";

function App() {
  const [dataHolder, setDataHolder] = useState();

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
        <Route element={<NavBar />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/markets"
            element={<Markets dataHolder={dataHolder} />}
          />
          <Route
            path="/coins/:id"
            element={<CoinDetailPage dataHolder={dataHolder} />}
          />
          <Route path="/crypto/:action" element={<BuySellPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
