import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CoinList from "./components/CoinList";
import AllCoins from "./components/AllCoin";
import { array } from "prop-types";

const Markets = (props) => {
  const { dataHolder, setCoinId } = props;

  const [trendingCoins, setTrendingCoins] = useState([]);
  const [gainerCoins, setGainerCoins] = useState([]);
  const [volumeCoins, setVolumeCoins] = useState([]);
  const coinsToShow = 3;

  useEffect(() => {
    const fetchCoins = async (sortFunction, setFunction) => {
      if (dataHolder) {
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
      <h1>Markets Overview</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Trending</h2>
              <CoinList coins={trendingCoins} setCoinId={setCoinId} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Top Gainer</h2>
              <CoinList coins={gainerCoins} setCoinId={setCoinId} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Top Volume</h2>
              <CoinList coins={volumeCoins} setCoinId={setCoinId} />
            </div>
          </div>
        </div>
      </div>
      <AllCoins setCoinId={setCoinId} />
    </div>
  );
};

Markets.propTypes = {
  dataHolder: array,
};

export default Markets;
