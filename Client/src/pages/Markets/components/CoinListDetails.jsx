import { any } from "prop-types";
import { useNavigate } from "react-router-dom";

const CoinListDetails = ({ coins, setCoinId }) => {
  const navigate = useNavigate();

  return (
    <tbody>
      {coins.map((coin) => (
        <tr
          key={coin.id}
          onClick={() => {
            setCoinId(coin.id);
            navigate(`/trade/${coin.id}`);
          }}
        >
          <td>{coin.name}</td>
          <td>${parseFloat(coin.priceUsd).toFixed(2)}</td>
          <td>{`{parseFloat(coin.changePercent24Hr).toFixed(2)}%`}</td>
          <td>${parseFloat(coin.volumeUsd24Hr).toFixed(2)}</td>
          <td>${parseFloat(coin.marketCapUsd).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  );
};

CoinListDetails.propTypes = {
  coins: any,
};

export default CoinListDetails;
