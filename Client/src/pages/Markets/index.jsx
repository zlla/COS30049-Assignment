import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CoinList from "./components/CoinList";
import AllCoins from "./components/AllCoin";
import { array } from "prop-types";

const Markets = (props) => {
  const { dataHolder } = props;

  const [trendingCoins, setTrendingCoins] = useState([]);
  const [gainerCoins, setGainerCoins] = useState([]);
  const [volumeCoins, setVolumeCoins] = useState([]);
  const coinsToShow = 6;

  useEffect(() => {
    const fetchCoins = async (sortFunction, setFunction) => {
      if (dataHolder) {
        console.log(dataHolder);
        const sortedCoins = [...dataHolder].sort(sortFunction);
        setFunction(sortedCoins.slice(0, coinsToShow));
      }
    };

    fetchCoins(
      (a, b) => b.changePercent24Hr - a.changePercent24Hr,
      setGainerCoins
    );
    fetchCoins((a, b) => b.volumeUsd24hr - a.volumeUsd24hr, setVolumeCoins);
    fetchCoins((a, b) => 0, setTrendingCoins);
  }, [dataHolder]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Trending Coins</h2>
              <CoinList coins={trendingCoins} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Top Gainer Coins</h2>
              <CoinList coins={gainerCoins} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Top Volume Coins</h2>
              <CoinList coins={volumeCoins} />
            </div>
          </div>
        </div>
      </div>
      <AllCoins />
    </div>
  );
};

Markets.propTypes = {
  dataHolder: array,
};

export default Markets;
