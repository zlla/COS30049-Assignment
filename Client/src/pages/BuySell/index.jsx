import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { FaBitcoin, FaUserPlus, FaShieldAlt } from "react-icons/fa";

import "./style/index.css";
import Chart from "./components/chart";
import CoinConversionTable from "./components/CoinConversionTable";
import { coinHolder } from "../../../data/coinBuySellPage";
import { allCoins } from "./js/dataholder";

const BuySellPage = () => {
  const { action } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [coinToUsdRate, setCoinToUsdRate] = useState(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [coin, setCoin] = useState(null);

  const [filteredCoins, setFilteredCoins] = useState([]);
  const [isSearchListOpen, setIsSearchListOpen] = useState(true);
  const [selectedCoinName, setSelectedCoinName] = useState("Bitcoin");
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");

  const handleBuySellButton = (e) => {
    if (e.target.innerHTML.toLowerCase() !== action.toLowerCase()) {
      if (action.toLowerCase() === "buy") {
        navigate("/crypto/sell");
      } else {
        navigate("/crypto/buy");
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const searchInput = e.target.value.toLowerCase();
    const filtered = allCoins.filter(
      (coin) =>
        coin.symbol.toLowerCase().includes(searchInput) ||
        coin.id.toLowerCase().includes(searchInput.toString())
    );
    const firstFiveFiltered = filtered.slice(0, 5);
    setFilteredCoins(firstFiveFiltered);
    setIsSearchListOpen(searchInput.trim() !== "");
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoinId(coin.id);
    setSelectedCoinName(coin.name);
    setFilteredCoins([]);
  };

  const handleCoinInputChange = (e) => {
    const inputCoinValue = e.target.value;
    setCoinAmount(inputCoinValue);
    setUsdAmount(inputCoinValue * coinToUsdRate);
  };

  const handleUsdInputChange = (e) => {
    const inputUsdValue = e.target.value;
    setUsdAmount(inputUsdValue);
    setCoinAmount(inputUsdValue / coinToUsdRate);
  };

  const [showFull, setShowFull] = useState(false);
  const maxLength = 500;

  const toggleShow = () => {
    setShowFull(!showFull);
  };

  const handleSubmitBtn = (e) => {
    e.preventDefault();

    const walletAddress = "";
    const coinId = selectedCoinId;
    const amount = coinAmount;
    const totalPrice = coinToUsdRate;
    const transactionType = action;

    console.log(selectedCoinId);
    console.log(coinAmount);
    console.log(coinToUsdRate);
    console.log(action);
  };

  useEffect(() => {
    let retryCount = 0;

    const fetchCoinById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoinId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );

        setCoin(response.data);
        setCoinToUsdRate(response.data.market_data.current_price.usd);
      } catch (error) {
        console.log(error);
        if (retryCount < 3) {
          // Retry only 3 times
          setTimeout(() => {
            retryCount += 1;
            fetchCoinById();
          }, 300000); // Wait for 5 minutes before retrying
        }
      }
    };

    if (selectedCoinId !== "") {
      fetchCoinById();
    }
  }, [selectedCoinId]);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Section - Placeholder */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card" style={{ border: "none" }}>
            <div className="card-body">
              <h2 className="mb-4">
                {action.charAt(0).toUpperCase() + action.slice(1)} Crypto
              </h2>
              <p className="lead mb-4">Various payment methods available</p>
              <p>
                <FaUserPlus size={24} /> Sign Up
              </p>
              <p>
                <FaShieldAlt size={24} /> Verify Account
              </p>
              <p className="mb-0">
                <FaBitcoin size={24} />{" "}
                {action.charAt(0).toUpperCase() + action.slice(1)} Crypto
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Trade Form with Conversion */}
        <div className="col-md-6">
          {!isLoading && (
            <div className="card">
              <div className="card-body">
                <Row>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      onClick={(e) => handleBuySellButton(e)}
                      className="w-100"
                    >
                      Buy
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="danger"
                      onClick={(e) => handleBuySellButton(e)}
                      className="w-100"
                    >
                      Sell
                    </Button>
                  </Col>
                </Row>

                <form>
                  {/* Coin Amount Input */}
                  <div className="mb-3">
                    <label htmlFor="coinAmount" className="form-label">
                      Coin Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="coinAmount"
                      value={coinAmount}
                      onChange={handleCoinInputChange}
                      disabled={!selectedCoinId || coinToUsdRate === null}
                    />
                  </div>

                  {/* USD Amount Input */}
                  <div className="mb-3">
                    <label htmlFor="usdAmount" className="form-label">
                      USD Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="usdAmount"
                      value={usdAmount}
                      onChange={handleUsdInputChange}
                      disabled={!selectedCoinId || coinToUsdRate === null}
                    />
                  </div>
                  {!selectedCoinId && (
                    <span style={{ color: "red" }}>
                      *Please select Coin Type first!
                    </span>
                  )}
                  {selectedCoinId && coinToUsdRate === null && (
                    <span style={{ color: "red" }}>
                      *Please wait a second to get Coin Price!
                    </span>
                  )}

                  {/* Coin Search Input */}
                  <div className="mb-3">
                    <label htmlFor="coinSearch" className="form-label">
                      Coin Type (Default is <b>Bitcoin</b>)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="coinSearch"
                      placeholder="Enter coin name"
                      onChange={handleSearchInputChange}
                    />
                  </div>

                  {/* Display Filtered Coins */}
                  <div className="mb-3">
                    {isSearchListOpen && filteredCoins.length > 0 && (
                      <div>
                        {/* <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setFilteredCoins([]);
                            setIsSearchListOpen(false);
                          }}
                        >
                          Close
                        </button> */}

                        <ul className="list-group">
                          {filteredCoins.map((coin) => (
                            <li
                              key={coin.id}
                              className="list-group-item"
                              onClick={() => handleCoinSelect(coin)}
                              style={{ cursor: "pointer" }}
                            >
                              {coin.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!selectedCoinName && !isSearchListOpen && (
                      <p>No matching coins found</p>
                    )}
                  </div>

                  {/* Display Selected Coin Name */}
                  {selectedCoinName && (
                    <p className="mb-3">
                      Selected Coin: <b>{selectedCoinName}</b>
                    </p>
                  )}

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={(e) => handleSubmitBtn(e)}
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </button>
                </form>
              </div>
            </div>
          )}
          {isLoading && <h1>Loading ...</h1>}
        </div>
      </div>
      <div className="row  m-5">
        <div className="col-md-6">
          {selectedCoinId && coin && (
            <div>
              <div className="d-flex justify-content-between">
                <h3>{selectedCoinName}/USD</h3>
                <div>
                  <h5>{coin?.market_data.price_change_24h}%</h5>
                  <h3>${coin?.market_data.current_price.usd}</h3>
                </div>
              </div>
              <Chart coinId={selectedCoinId} />
            </div>
          )}
        </div>
        {coin && (
          <div className="col-md-6">
            <h3>{selectedCoinName} Markets</h3>
            <div className="d-flex">
              <p className="font-weight-bold me-4 lead ">
                market cap rank <br />
                <b className="text-info">
                  #{coin?.market_data.market_cap_rank}
                </b>
              </p>
              <p className="font-weight-bold lead">
                market cap <br />
                <b className="text-info">{coin?.market_data.market_cap.usd}</b>
              </p>
            </div>
            <div className="d-flex">
              <p className="font-weight-bold me-4 lead">
                total volume <br />
                <b className="text-info">
                  {coin?.market_data.total_volume.usd}
                </b>
              </p>
              <p className="font-weight-bold lead">
                circulating supply <br />
                <b className="text-info">
                  {coin?.market_data.circulating_supply}
                </b>
              </p>
            </div>
            <div>
              <p>
                {showFull
                  ? coin?.description.en
                  : `${coin?.description.en.slice(0, maxLength)}...`}
              </p>
              <a
                onClick={toggleShow}
                className={`btn btn-link ${showFull ? "text-danger" : ""}  p-0`}
              >
                {showFull ? "Show Less" : "Show More"}
              </a>
            </div>
          </div>
        )}
      </div>
      {coin && (
        <CoinConversionTable coinValue={coin?.market_data.current_price.usd} />
      )}
    </div>
  );
};

export default BuySellPage;
