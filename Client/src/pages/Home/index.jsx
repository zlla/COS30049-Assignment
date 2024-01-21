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

const Home = () => {
  const carouselData = [
    {
      imageLink:
        "https://th.bing.com/th/id/OIP.k6oYgmmsBLwv9DVtzc6o6AHaE8?w=286&h=190&c=7&r=0&o=5&pid=1.7",
      imageTitle: "Ancient Roman Coin",
      imageDesc:
        "A fascinating ancient Roman coin depicting historical figures and events. Explore the rich history of Roman civilization.",
    },
    {
      imageLink:
        "https://th.bing.com/th/id/OIP.2iv02FC4Pc4eK3HQYfPuKAHaEI?w=325&h=181&c=7&r=0&o=5&pid=1.7",
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
        console.log(error);
      }
    };

    fetchTrendingCoins();
    fetchMarketChartById();
  }, []);

  const minPriceValue = Math.min(...chartData.map((entry) => entry.price));
  const maxPriceValue = Math.max(...chartData.map((entry) => entry.price));

  return (
    <Container className="mt-4 pt-5">
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
        <Col lg={6} className="mb-4">
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
      <div className="mt-5">
        <h2 className="text-primary">Popular Chart: BTC</h2>
        <div className="d-flex justify-content-between">
          {/* Line Chart for Price */}

          <LineChart width={600} height={300} data={chartData}>
            <XAxis dataKey="timestamp" />
            <YAxis
              domain={[
                minPriceValue - 0.1 * (maxPriceValue - minPriceValue),
                maxPriceValue + 0.1 * (maxPriceValue - minPriceValue),
              ]}
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
            <YAxis orientation="right" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_volumes" fill="#82ca9d" />
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </BarChart>
        </div>
      </div>
    </Container>
  );
};

export default Home;
