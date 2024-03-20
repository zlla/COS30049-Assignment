import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CoinDetailPage from "./pages/Coin/CoinDetails";
import BuySellPage from "./pages/BuySell";
import Footer from "./components/Footer";
import Wallet from "./pages/Wallet";
import Account from "./pages/Account";
import { dataAppHolder } from "../data/dataApp";
import SignUp from "./pages/Auth/Register";
import LogIn from "./pages/Auth/Login";
import { apiUrl } from "./settings/apiurl";

import abi from "./smartcontracts/ProMinTrader.json";

function App() {
  const initialToken = localStorage.getItem("accessToken");
  const [token, setToken] = useState(initialToken);
  const [auth, setAuth] = useState(!!initialToken);
  const [instance, setInstance] = useState(null);
  const [web3, setWeb3] = useState(null);

  const fetchNewToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const axiosInstance = axios.create({
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refreshToken,
        },
      });
      const response = await axiosInstance.post(`${apiUrl}/auth/refreshToken`);
      let newAccessToken = response.data.accessToken;

      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      setToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewToken();

    const intervalId = setInterval(fetchNewToken, 30000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.post(`${apiUrl}/auth/validateToken`, {
          AccessToken: token,
        });
        setAuth(true);
      } catch (error) {
        setAuth(false);
        console.log("Error during validation:", error);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const [dataHolder, setDataHolder] = useState();
  const [coinId, setCoinId] = useState("bitcoin");

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        const response = await axios.get("https://api.coincap.io/v2/assets");
        const data = response.data.data;
        setDataHolder(data);
      } catch (error) {
        setDataHolder(dataAppHolder);
        console.error("Error fetching volume coins:", error);
      }
    };

    fetchCoinsData();
  }, []);

  useEffect(() => {
    const loadWeb3 = async () => {
      const temp1 = await new Web3("http://localhost:8545");
      setWeb3(temp1);

      try {
        // Initialize Web3 with localhost provider
        const web3Provider = new Web3.providers.HttpProvider(
          "http://localhost:8545"
        );
        const web3 = new Web3(web3Provider);

        // Get contract artifact
        const artifact = abi;
        const contract = TruffleContract(artifact);
        contract.setProvider(web3.currentProvider);

        // Deploy the contract and get instance
        let temp2 = await contract.deployed();
        console.log(temp2);
        setInstance(temp2);
      } catch (error) {
        console.error("Error deploying contract:", error);
      }
    };

    loadWeb3();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<NavBar coinId={coinId} auth={auth} setAuth={setAuth} />}
        >
          <Route element={<Footer />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/auth/login" element={<LogIn setAuth={setAuth} />} />
            <Route
              path="/markets"
              element={
                <Markets dataHolder={dataHolder} setCoinId={setCoinId} />
              }
            />
            <Route
              path="/trade/:id"
              element={
                <CoinDetailPage
                  dataHolder={dataHolder}
                  coinId={coinId}
                  setCoinId={setCoinId}
                />
              }
            />

            <Route
              path="/crypto/:action"
              element={
                auth ? (
                  <BuySellPage auth={auth} instance={instance} web3={web3} />
                ) : (
                  <Navigate to="/auth/login" />
                )
              }
            />
            <Route
              path="/wallet"
              element={
                auth ? (
                  <Wallet auth={auth} web3={web3} />
                ) : (
                  <Navigate to="/auth/login" />
                )
              }
            />
            <Route path="/account" element={<Account />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
