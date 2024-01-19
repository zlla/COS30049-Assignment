import CoinCard from "./CoinCard";

const CoinList = ({ coins }) => (
  <div>
    {coins.map((coin) => (
      <CoinCard key={coin.id} coin={coin} />
    ))}
  </div>
);

export default CoinList;
