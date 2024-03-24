import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { FaBitcoin, FaUserPlus, FaShieldAlt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

import "./style/index.css";
import CoinConversionTable from "./components/CoinConversionTable";
import { unlockAccount } from "../../js/unlockWalletAddress";
import { apiUrl } from "../../settings/apiurl";

const BuySellPage = (props) => {
  const { instance, web3 } = props;
  const { action } = useParams();
  const navigate = useNavigate();

  const [allSystemCoins, setAllSystemCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coinToUsdRate, setCoinToUsdRate] = useState(null);
  const [coinAmount, setCoinAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const [filteredCoins, setFilteredCoins] = useState([]);
  const [isSearchListOpen, setIsSearchListOpen] = useState(true);
  const [selectedCoinName, setSelectedCoinName] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState("");

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
    const filtered = allSystemCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchInput.toString()) ||
        coin.id.toLowerCase().includes(searchInput.toString())
    );
    const firstFiveFiltered = filtered.slice(0, 5);
    setFilteredCoins(firstFiveFiltered);
    setIsSearchListOpen(searchInput.trim() !== "");
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoinId(coin.id);
    setSelectedCoinName(coin.name);
    setCoinToUsdRate(coin.price);
    setUsdAmount(Math.ceil(coin.price * coinAmount));
    setFilteredCoins([]);

    const coinInput = document.getElementById("coinSearch");
    if (coinInput) {
      coinInput.value = coin.name;
    }
  };

  const handleCoinInputChange = (e) => {
    let inputValue = e.target.value.trim(); // Remove leading/trailing whitespace
    if (inputValue === "") {
      inputValue = "0";
    }
    let parsedValue = parseInt(inputValue); // Parse input as integer

    // Check if the parsed value is a valid number
    if (!isNaN(parsedValue)) {
      // If the input is a valid positive integer, update the state
      setCoinAmount(parsedValue);
      setUsdAmount(parsedValue * Math.ceil(coinToUsdRate));
      setFormError(""); // Clear any previous form errors
    } else {
      // If the input is not a valid positive integer, display an error message
      setFormError("Coin amount must be a positive integer.");
    }
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    setFormError("");

    if (selectedCoinId && coinAmount && coinToUsdRate && action) {
      try {
        setSubmitBtnStatus(true);

        const confirmation = confirm(
          `Are you sure to ${action} ${coinAmount} with ${usdAmount} NPM`
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

        if (action == "buy") {
          await instance.addTransaction(
            walletAddress,
            selectedCoinId,
            coinAmount,
            usdAmount,
            action,
            {
              from: walletAddress,
              value: usdAmount,
            }
          );
        } else {
          try {
            await axios.post(
              `${apiUrl}/asset/sell`,
              { AssetId: selectedCoinId, AssetAmount: coinAmount },
              config
            );
          } catch (error) {
            if (error.response.data) {
              alert(error.response.data);
            }
            return;
          }

          await instance.addTransaction(
            walletAddress,
            selectedCoinId,
            coinAmount,
            usdAmount,
            action,
            {
              from: "0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42",
            }
          );
        }

        const checkCoinExistInDb = async () => {
          try {
            const response = await axios.get(
              `${apiUrl}/asset/checkAssetExist?coinId=${selectedCoinId}`,
              config
            );

            if (response.data === true) {
              const request = {
                AssetId: selectedCoinId,
                Amount: coinAmount,
                Action: action,
              };

              await axios.post(
                `${apiUrl}/asset/updateAmountOfAsset`,
                request,
                config
              );
            } else {
              const newAsset = {
                Id: 0,
                WalletId: 0,
                CoinId: selectedCoinId,
                Amount: coinAmount,
              };

              await axios.post(`${apiUrl}/asset/newAsset`, newAsset, config);
            }
          } catch (error) {
            console.log(error);
          }
        };

        if (action === "buy") {
          await checkCoinExistInDb();
        } else if (action === "sell") {
          const request = {
            AssetId: selectedCoinId,
            Amount: coinAmount,
            Action: action,
          };

          await axios.post(
            `${apiUrl}/asset/updateAmountOfAsset`,
            request,
            config
          );
        }
        alert("Transaction added successfully.");
      } catch (error) {
        console.log(error);
        setFormError(error.response.data);
      } finally {
        setSubmitBtnStatus(false);
      }
    } else {
      setFormError("Form data not valid");
    }
  };

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`${apiUrl}/SystemCoin/GetCoins`)
      .then(async (response) => {
        setAllSystemCoins(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
                    <div className="d-flex align-items-center">
                      <MdAttachMoney size={24} />
                      <p className="m-0 fs-5 fw-bold">{`${usdAmount}`}</p>
                    </div>
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
                      Coin Type
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

      {!isLoading && coinToUsdRate && (
        <CoinConversionTable coinValue={coinToUsdRate} />
      )}
    </div>
  );
};

export default BuySellPage;
