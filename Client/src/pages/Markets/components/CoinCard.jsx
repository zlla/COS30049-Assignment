import { useNavigate } from "react-router-dom";

const CoinCard = ({ coin }) => {
  const navigate = useNavigate();

  const formattedPrice = parseFloat(coin.priceUsd).toFixed(2);
  const formattedchangePercent24Hr = parseFloat(coin.changePercent24Hr).toFixed(
    2
  );

  return (
    <tr
      key={coin.id}
      onClick={() => {
        navigate(`/coins/${coin.id}`);
      }}
    >
      <td>{coin.symbol}</td>
      <td>${formattedPrice}</td>
      <td>{formattedchangePercent24Hr}%</td>
    </tr>
  );
};

export default CoinCard;
