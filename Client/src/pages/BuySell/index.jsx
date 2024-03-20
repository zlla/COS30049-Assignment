import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { FaBitcoin, FaUserPlus, FaShieldAlt } from "react-icons/fa";

import "./style/index.css";
import Chart from "./components/chart";
import CoinConversionTable from "./components/CoinConversionTable";
import { allCoins } from "./js/dataholder";
import { unlockAccount } from "../../js/unlockWalletAddress";
import { apiUrl } from "../../settings/apiurl";

const BuySellPage = (props) => {
  const { instance, web3 } = props;
  const { action } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [coinToUsdRate, setCoinToUsdRate] = useState(null);
  const [coinAmount, setCoinAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [coin, setCoin] = useState(null);

  const [filteredCoins, setFilteredCoins] = useState([]);
  const [isSearchListOpen, setIsSearchListOpen] = useState(true);
  const [selectedCoinName, setSelectedCoinName] = useState("Bitcoin");
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");

  const [formError, setFormError] = useState("");
  const [submitBtnStatus, setSubmitBtnStatus] = useState(false);

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
    let inputValue = e.target.value.trim(); // Remove leading/trailing whitespace
    if (inputValue === "") {
      inputValue = "1"; // Update to '1' if input is empty
    }
    let parsedValue = parseInt(inputValue); // Parse input as integer

    // Check if the parsed value is a valid number
    if (!isNaN(parsedValue) && parsedValue > 0) {
      // If the input is a valid positive integer, update the state
      setCoinAmount(parsedValue);
      setUsdAmount(parsedValue * Math.ceil(coinToUsdRate));
      setFormError(""); // Clear any previous form errors
    } else {
      // If the input is not a valid positive integer, display an error message
      setFormError("Coin amount must be a positive integer.");
    }
  };

  const handleUsdInputChange = (e) => {
    let inputValue = e.target.value.trim();
    if (inputValue < coinToUsdRate) {
      inputValue = coinToUsdRate;
    }
    let parsedValue = parseInt(inputValue); // Parse input as integer

    if (!isNaN(parsedValue) && parsedValue >= coinToUsdRate) {
      setUsdAmount(parsedValue);
      setCoinAmount(Math.ceil(parsedValue / coinToUsdRate));
      setFormError("");
    } else {
      setFormError("USD amount must be a positive integer.");
    }
  };

  const [showFull, setShowFull] = useState(false);
  const maxLength = 500;

  const toggleShow = () => {
    setShowFull(!showFull);
  };

  const handleSubmitBtn = async (e) => {
    try {
      e.preventDefault();
      setSubmitBtnStatus(true);
      setFormError("");

      const coinId = selectedCoinId;
      const amount = Math.ceil(coinAmount);
      const totalPrice = Math.ceil(coinToUsdRate * amount);
      const transactionType = action;

      setCoinAmount(amount);
      setUsdAmount(totalPrice);

      const confirmation = confirm(
        `Are you sure to buy ${amount} with ${totalPrice} NPM`
      );
      if (!confirmation) {
        setFormError("Transaction is cancelled!");
        return;
      }

      if (!window.ethereum) {
        setFormError("MetaMask not detected. Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      await Promise.all([
        axios.post(
          `${apiUrl}/wallet/isSameWallet`,
          { Value: walletAddress },
          config
        ),
        unlockAccount(web3, walletAddress),
      ]);

      await instance.addTransaction(
        walletAddress,
        coinId,
        amount,
        totalPrice,
        transactionType,
        {
          from: walletAddress,
          value: totalPrice,
        }
      );

      const checkCoinExistInDb = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/asset/checkAssetExist?coinId=${coinId}`,
            config
          );

          console.log(response.data);
          if (response.data === true) {
            const Amount = {
              Amount: amount,
            };

            await axios.post(
              `${apiUrl}/asset/updateAmountOfAsset`,
              Amount,
              config
            );
          } else {
            const newAsset = {
              Id: 0,
              WalletId: 0,
              CoinId: coinId,
              Amount: amount,
            };

            await axios.post(`${apiUrl}/asset/newAsset`, newAsset, config);
          }
        } catch (error) {
          console.log(error);
        }
      };

      await checkCoinExistInDb();
      alert("Transaction added successfully.");

      // const a = await instance.getContractBalance();
      // console.log(a);
    } catch (error) {
      // console.error(error.response.data);
      setFormError(error.response.data);
    } finally {
      setSubmitBtnStatus(false);
    }
  };

  useEffect(() => {
    const fetchCoinById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoinId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );

        setCoin(response.data);
        setCoinToUsdRate(response.data.market_data.current_price.usd);
        setUsdAmount(
          Math.ceil(coinAmount * response.data.market_data.current_price.usd)
        );
      } catch (error) {
        alert("Too many request, please wait a few minutes and try again!");
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

                <form
                  onChange={() => {
                    setFormError("");
                  }}
                >
                  {/* Coin Amount Input */}
                  <div className="mb-3">
                    <label htmlFor="coinAmount" className="form-label">
                      Coin Amount
                    </label>
                    <input
                      type="number"
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
                      type="number"
                      className="form-control"
                      id="usdAmount"
                      value={usdAmount}
                      onChange={handleUsdInputChange}
                      // disabled={!selectedCoinId || coinToUsdRate === null}
                      disabled
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

                  <span className="text-danger">{formError}</span>
                  <br />

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={(e) => handleSubmitBtn(e)}
                    disabled={submitBtnStatus}
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
