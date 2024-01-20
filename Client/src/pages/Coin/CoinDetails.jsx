import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CoinDetailPage = (props) => {
  const { id } = useParams();
  const { dataHolder } = props;
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMarketChartById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );

        // Transform data to match the format expected by Recharts
        const formattedData = response.data.prices.map((entry, index) => ({
          timestamp: new Date(entry[0]).toLocaleString(),
          price: entry[1],
          vol: response.data.total_volumes[index][1], // Assuming total_volumes has the same length as prices
          market: response.data.market_caps[index][1], // Assuming market_caps has the same length as prices
        }));

        // Update chart data state
        setChartData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMarketChartById();
  }, [id]);

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

  const minPriceValue = Math.min(...chartData.map((entry) => entry.price));
  const maxPriceValue = Math.max(...chartData.map((entry) => entry.price));

  const minVolumeValue = Math.min(...chartData.map((entry) => entry.vol));
  const maxVolumeValue = Math.max(...chartData.map((entry) => entry.vol));

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

      <ResponsiveContainer width="80%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="timestamp" />

          {/* YAxis for the "Price" line */}
          <YAxis
            yAxisId="priceAxis"
            domain={[
              minPriceValue - 0.1 * (maxPriceValue - minPriceValue),
              maxPriceValue + 0.1 * (maxPriceValue - minPriceValue),
            ]}
          />

          {/* YAxis for the "Volume" line */}
          <YAxis
            yAxisId="volumeAxis"
            orientation="right"
            domain={[
              minVolumeValue - 0.1 * (maxVolumeValue - minVolumeValue),
              maxVolumeValue + 0.1 * (maxVolumeValue - minVolumeValue),
            ]}
          />

          <Tooltip />
          <Legend />

          {/* "Price" line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            name="Price"
            yAxisId="priceAxis"
          />

          {/* "Volume" line */}
          <Line
            type="monotone"
            dataKey="vol"
            stroke="#82ca9d"
            name="Volume"
            yAxisId="volumeAxis"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinDetailPage;
