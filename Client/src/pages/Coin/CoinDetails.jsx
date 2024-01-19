import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CoinDetailPage = (props) => {
  const { id } = useParams();
  const { dataHolder } = props;
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    if (dataHolder) {
      const foundCoinData = dataHolder.find((coin) => coin.id === id);
      if (foundCoinData) {
        setCoinData(foundCoinData);
      }
    }
  }, [dataHolder, id]);

  if (!coinData) {
    return <div>Loading coin data...</div>;
  }

  const {
    name,
    symbol,
    priceUsd,
    marketCapUsd,
    volumeUsd24Hr,
    changePercent24Hr,
    vwap24Hr,
  } = coinData;

  const chartData = [
    { name: "Jan", price: 65 },
    { name: "Feb", price: 59 },
    { name: "Mar", price: 80 },
    { name: "Apr", price: 81 },
    { name: "May", price: 56 },
    { name: "Jun", price: 55 },
  ];

  return (
    <div>
      <h1>
        {name} ({symbol})
      </h1>
      <p>Price: ${priceUsd}</p>
      <p>Market Cap: ${marketCapUsd}</p>
      <p>Volume (24hr): ${volumeUsd24Hr}</p>
      <p>Change (24hr): {changePercent24Hr}%</p>
      <p>VWAP (24hr): ${vwap24Hr}</p>

      <LineChart width={600} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default CoinDetailPage;
