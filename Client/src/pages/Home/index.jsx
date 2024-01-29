import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { trendingCoinsHolder } from "../../../data/trendingCoins";
import { formattedDataHolder } from "../../../data/chartDataHomePage";

const Home = () => {
  const carouselData = [
    {
      imageLink:
        "https://static.vecteezy.com/system/resources/previews/002/411/208/non_2x/business-growth-concept-businesswoman-nurturing-a-dollar-tree-with-watering-can-vector.jpg",
      imageTitle: "Ancient Roman Coin",
      imageDesc:
        "A fascinating ancient Roman coin depicting historical figures and events. Explore the rich history of Roman civilization.",
    },
    {
      imageLink:
        "https://img.money.com/2020/03/final-self-employ-saving.jpg?quality=85",
      imageTitle: "Rare Gold Coin",
      imageDesc:
        "A rare and valuable gold coin showcasing exquisite craftsmanship. Learn about the rarity and significance of this precious numismatic item.",
    },
  ];

  const [trendingCoins, setTrendingCoins] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/search/trending`
        );
        setTrendingCoins(response.data.coins.slice(1, 4));
      } catch (error) {
        setTrendingCoins(trendingCoinsHolder);
        console.log(error);
      }
    };

    const fetchMarketChartById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30`
        );
        const formattedData = response.data.prices.map((entry, index) => ({
          timestamp: new Date(entry[0]).toLocaleString(),
          price: entry[1],
          total_volumes: response.data.total_volumes[index][1],
        }));

        setChartData(formattedData);
      } catch (error) {
        setChartData(formattedDataHolder);
        console.log(error);
      }
    };

    fetchTrendingCoins();
    fetchMarketChartById();
  }, []);

  const minPriceValue = Math.min(...chartData.map((entry) => entry.price));
  const maxPriceValue = Math.max(...chartData.map((entry) => entry.price));

  const formatYAxisValue = (value) => {
    const absValue = Math.abs(value);

    if (absValue >= 1e12) {
      return (value / 1e12).toFixed(1) + "T";
    } else if (absValue >= 1e9) {
      return (value / 1e9).toFixed(1) + "B";
    } else if (absValue >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    } else if (absValue >= 1e3) {
      return (value / 1e3).toFixed(1) + "k";
    } else {
      return value.toFixed(1);
    }
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    const formattedValue = formatYAxisValue(payload.value);

    return (
      <text
        x={x}
        y={y}
        textAnchor="end"
        fill="#666"
        transform={`rotate(0 ${x},${y})`}
      >
        {formattedValue}
      </text>
    );
  };

  return (
    <Container className="mt-2 pt-2">
      <Row className="d-flex justify-content-around">
        <Col
          lg={6}
          className="my-4 d-flex align-items-center justify-content-center"
        >
          <div className="intro-text">
            <h1 className="text-primary">Welcome to Crypto Exchange</h1>
            <p className="text-secondary">
              Explore the world of cryptocurrencies and start your trading
              journey. Buy, sell, and discover the latest trends in the crypto
              market.
            </p>
          </div>
        </Col>
        <Col lg={6}>
          <div className="crypto-container p-3">
            <div
              className="crypto-block-1 border-primary rounded p-3"
              style={{ border: "2px solid #007BFF", borderRadius: "15px" }}
            >
              <h2 className="mb-4 text-primary">Featured Cryptocurrencies</h2>
              <table style={{ width: "100%" }}>
                <tbody>
                  {trendingCoins.map((coin) => (
                    <tr key={coin.item.id}>
                      <td className="text-primary me-3">{coin.item.name}</td>
                      <td className="me-3">{coin.item.data.price}</td>
                      <td className="percentage">
                        {coin.item.data.price_change_percentage_24h.usd
                          .toString()
                          .slice(0, 5)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="crypto-block-2 border-secondary rounded p-3 mt-4"
              style={{ border: "2px solid #6C757D", borderRadius: "15px" }}
            >
              <p>
                Discover a new era in cryptocurrency exchange – where
                credibility, quality, and security converge. With a
                user-friendly interface, top-notch support, and robust security,
                we offer a seamless trading experience. Join us for a new
                standard in crypto trading!
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <div className="my-4">
        <h2 className="text-primary">Popular Chart: BTC</h2>
        <div className="d-flex justify-content-evenly">
          {/* Line Chart for Price */}

          <LineChart width={600} height={300} data={chartData}>
            <XAxis dataKey="timestamp" />
            <YAxis
              domain={[
                minPriceValue - 0.1 * (maxPriceValue - minPriceValue),
                maxPriceValue + 0.1 * (maxPriceValue - minPriceValue),
              ]}
              tick={<CustomYAxisTick />}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
            />
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </LineChart>

          {/* Bar Chart for Volume */}
          <BarChart width={600} height={300} data={chartData}>
            <XAxis dataKey="timestamp" />
            <YAxis tick={<CustomYAxisTick />} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_volumes" fill="#82ca9d" />
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div>
        <Carousel style={{ borderRadius: "15px" }}>
          {carouselData.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                style={{
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
                src={item.imageLink}
                alt="Carousel slide"
              />
              {item.imageTitle || item.imageDesc ? (
                <Carousel.Caption>
                  {item.imageTitle && <h3>{item.imageTitle}</h3>}
                  {item.imageDesc && <p>{item.imageDesc}</p>}
                </Carousel.Caption>
              ) : null}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default Home;
