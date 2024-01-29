// AdditionalInfo.js
import { useEffect, useState } from "react";
import axios from "axios";

const AdditionalInfo = ({ coinId, setCoinId }) => {
  const [additionalInfo, setAdditionalInfo] = useState(null);

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        const coinGeckoResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}`
        );

        const coinCapResponse = await axios.get(
          `https://api.coincap.io/v2/assets/${coinId}`
        );

        setAdditionalInfo({
          coinGecko: coinGeckoResponse.data,
          coinCap: coinCapResponse.data.data,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdditionalInfo();
  }, [coinId]);

  if (!additionalInfo) {
    return <div>Loading additional information...</div>;
  }

  const formatToTwoDecimalPlaces = (number) => {
    return Number(number).toFixed(2);
  };

  return (
    <div>
      <h2>Additional Information</h2>
      <p>
        Homepage:{" "}
        {additionalInfo.coinGecko.links?.homepage[0] && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={additionalInfo.coinGecko.links.homepage[0]}
          >
            {additionalInfo.coinGecko.links.homepage[0]}
          </a>
        )}
      </p>
      <p>
        Market Cap Rank: {additionalInfo.coinGecko.market_cap_rank || "N/A"}
      </p>
      <p>Genesis Date: {additionalInfo.coinGecko.genesis_date || "N/A"}</p>

      {/* Information from CoinCap API */}
      <p>
        Supply:{" "}
        {formatToTwoDecimalPlaces(additionalInfo.coinCap.supply) || "N/A"}
      </p>
      <p>
        Max Supply:{" "}
        {formatToTwoDecimalPlaces(additionalInfo.coinCap.maxSupply) || "N/A"}
      </p>
    </div>
  );
};

export default AdditionalInfo;
