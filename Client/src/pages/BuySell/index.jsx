import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BuySellPage = () => {
  const { action } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [coinToUsdRate, setCoinToUsdRate] = useState(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");

  const [allCoins, setAllCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [selectedCoinName, setSelectedCoinName] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState("");
  const [isSearchListOpen, setIsSearchListOpen] = useState(true);

  const handleBuySellButton = () => {
    if (action.toLowerCase() === "buy") {
      navigate("/crypto/sell");
    } else {
      navigate("/crypto/buy");
    }
  };

  const handleSearchInputChange = (e) => {
    const searchInput = e.target.value.toLowerCase();
    const filtered = allCoins.filter(
      (coin) =>
        coin.symbol.toLowerCase().includes(searchInput) ||
        coin.id.toLowerCase().includes(searchInput.toString())
    );
    setFilteredCoins(filtered);
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

  useEffect(() => {
    const fetchAllCoins = async () => {
      await axios
        .get("https://api.coincap.io/v2/assets")
        .then((response) => {
          setAllCoins(response.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(true);
        });
    };

    fetchAllCoins();
  }, []);

  useEffect(() => {
    const fetchCoinById = async () => {
      if (selectedCoinId !== "") {
        await axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${selectedCoinId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
          )
          .then((response) => {
            setCoinToUsdRate(response.data.market_data.current_price.usd);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    fetchCoinById();
  }, [selectedCoinId]);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Section - Placeholder */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h2>{action.charAt(0).toUpperCase() + action.slice(1)} Crypto</h2>
            </div>
          </div>
        </div>

        {/* Right Section - Trade Form with Conversion */}
        <div className="col-md-6">
          {!isLoading && (
            <div className="card">
              <div className="card-body">
                <div>
                  <button onClick={() => handleBuySellButton()}>Buy</button>
                  <button onClick={() => handleBuySellButton()}>Sell</button>
                </div>
                <h2>Trade Form</h2>
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
                    />
                    {!selectedCoinId && (
                      <span style={{ color: "red" }}>
                        Select Coin Type First
                      </span>
                    )}
                    {selectedCoinId && coinToUsdRate === null && (
                      <span style={{ color: "red" }}>
                        Please wait a second to get Coin Price
                      </span>
                    )}
                  </div>

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

                  <button type="submit" className="btn btn-success">
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </button>
                </form>
              </div>
            </div>
          )}
          {isLoading && <h1>Loading ...</h1>}
        </div>
      </div>
    </div>
  );
};

export default BuySellPage;
