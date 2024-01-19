const CoinCard = ({ coin }) => {
  const formattedPrice = parseFloat(coin.priceUsd).toFixed(2);
  const formattedchangePercent24Hr = parseFloat(coin.changePercent24Hr).toFixed(
    2
  );

  return (
    <div className="col">
      <div className="card border-0">
        <div className="d-flex justify-content-between">
          <p className="card-text">{coin.symbol}</p>
          <p className="card-text">${formattedPrice}</p>
          <p className="card-title">{formattedchangePercent24Hr}%</p>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
