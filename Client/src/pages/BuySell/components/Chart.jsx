import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { formattedDataChartHolder } from "../../../../data/chartBuySell";

const Chart = (props) => {
  const { coinId } = props;

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMarketChartById = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`
        );
        const formattedData = response.data.prices.map((entry, index) => ({
          timestamp: new Date(entry[0]).toLocaleString(),
          price: entry[1],
        }));
        setChartData(formattedData);
      } catch (error) {
        setChartData(formattedDataChartHolder);
        console.log(error);
      }
    };

    fetchMarketChartById();
  }, [coinId]);

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
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
            stroke="orange"
            strokeWidth={2}
            dot={false}
          />
          <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
