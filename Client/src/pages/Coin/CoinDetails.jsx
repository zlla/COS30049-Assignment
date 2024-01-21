import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";

const CoinDetailPage = (props) => {
  const { id } = useParams();
  const { dataHolder } = props;
  const [days, setDays] = useState(7);
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMarketChartById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );

        const formattedData = response.data.prices.map((entry, index) => ({
          timestamp: new Date(entry[0]).toLocaleString(),
          price: entry[1],
          vol: response.data.total_volumes[index][1],
        }));

        setChartData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMarketChartById();
    if (days === 1) {
      const intervalId = setInterval(fetchMarketChartById, 300000);

      return () => clearInterval(intervalId);
    }
  }, [id, days]);

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
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col>
          <div>
            <h1>
              {name} ({symbol})
            </h1>
            <p>Price: ${priceUsd}</p>
            <p>Market Cap: ${marketCapUsd}</p>
            <p>Volume (24hr): ${volumeUsd24Hr}</p>
            <p>Change (24hr): {changePercent24Hr}%</p>
            <p>VWAP (24hr): ${vwap24Hr}</p>

            <button
              onClick={() => {
                setDays(1);
              }}
            >
              1D
            </button>
            <button
              onClick={() => {
                setDays(7);
              }}
            >
              1W
            </button>
            <button
              onClick={() => {
                setDays(30);
              }}
            >
              1M
            </button>
            <button
              onClick={() => {
                setDays(90);
              }}
            >
              3M
            </button>
            <ResponsiveContainer width="80%" height={400}>
              <LineChart data={chartData}>
                <XAxis dataKey="timestamp" />

                <YAxis
                  yAxisId="priceAxis"
                  domain={[
                    minPriceValue - 0.1 * (maxPriceValue - minPriceValue),
                    maxPriceValue + 0.1 * (maxPriceValue - minPriceValue),
                  ]}
                />

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

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                  yAxisId="priceAxis"
                />

                <Line
                  type="monotone"
                  dataKey="vol"
                  stroke="#2196F3"
                  strokeWidth={2}
                  dot={false}
                  name="Volume"
                  yAxisId="volumeAxis"
                />

                <ReferenceLine
                  y={maxPriceValue}
                  yAxisId="priceAxis"
                  stroke="red"
                  strokeDasharray="3 3"
                  label="Max Price"
                />
                <ReferenceLine
                  y={minPriceValue}
                  yAxisId="priceAxis"
                  stroke="blue"
                  strokeDasharray="3 3"
                  label="Min Price"
                />

                <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CoinDetailPage;
