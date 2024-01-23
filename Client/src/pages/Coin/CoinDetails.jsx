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
import AdditionalInfo from "./components/AdditionalInfo";

const CoinDetailPage = (props) => {
  let { id } = useParams();
  const { dataHolder, coinId } = props;
  const [days, setDays] = useState(7);
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);

  if (id === null || id === "") {
    id = coinId;
  }

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

  const convertAndRoundToTwoDecimalPlaces = (value) => {
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      return Math.round((floatValue + Number.EPSILON) * 100) / 100;
    }
    return "Invalid Value";
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-stretch d-flex h-100 my-2 pt-4">
        <Col md={6} className="h-100">
          {/* Left Block */}
          <div className="left-block p-3 border rounded h-100">
            <h2>
              {name} ({symbol})
            </h2>
            <p>Price: ${convertAndRoundToTwoDecimalPlaces(priceUsd)}</p>
            <p>
              Market Cap: ${convertAndRoundToTwoDecimalPlaces(marketCapUsd)}
            </p>
            <p>
              Volume (24hr): ${convertAndRoundToTwoDecimalPlaces(volumeUsd24Hr)}
            </p>
            <p>
              Change (24hr): $
              {convertAndRoundToTwoDecimalPlaces(changePercent24Hr)}%
            </p>
            <p>VWAP (24hr): ${convertAndRoundToTwoDecimalPlaces(vwap24Hr)}</p>
          </div>
        </Col>

        <Col md={6} className="h-100">
          {/* Right Block */}
          <div className="right-block p-3 border rounded h-100">
            <AdditionalInfo coinId={id} />
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-primary" onClick={() => setDays(1)}>
          1D
        </button>
        <button className="btn btn-primary" onClick={() => setDays(7)}>
          1W
        </button>
        <button className="btn btn-primary" onClick={() => setDays(30)}>
          1M
        </button>
        <button className="btn btn-primary" onClick={() => setDays(90)}>
          3M
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
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
    </Container>
  );
};

export default CoinDetailPage;
