import { useState, useEffect } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CoinConversionTable = ({ coinValue }) => {
  const [coinToUsd, setCoinToUsd] = useState([]);
  const [usdToCoin, setUsdToCoin] = useState([]);

  useEffect(() => {
    const coinToUsdConversion = [1, 5, 10, 100, 500, 1000].map((value) => ({
      coin: value,
      usdEquivalent: (value * coinValue).toFixed(2),
    }));
    setCoinToUsd(coinToUsdConversion);

    const usdToCoinConversion = [1, 5, 10, 100, 500, 1000].map((value) => ({
      usd: value,
      coinEquivalent: value / coinValue,
    }));
    setUsdToCoin(usdToCoinConversion);
  }, [coinValue]);

  const renderTable = (data, heading) => (
    <Container>
      <h2>{heading}</h2>
      <Table striped bordered hover className="conversion-table">
        <thead>
          <tr>
            <th>{heading === "Coin to USD" ? "Coin Value" : "USD Value"}</th>
            <th>
              {heading === "Coin to USD" ? "USD Equivalent" : "Coin Equivalent"}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[heading === "Coin to USD" ? "coin" : "usd"]}>
              <td>{row[heading === "Coin to USD" ? "coin" : "usd"]}</td>
              <td>{row.usdEquivalent || row.coinEquivalent}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );

  return (
    <Container>
      <Row>
        <Col>{renderTable(coinToUsd, "Coin to USD")}</Col>
        <Col>{renderTable(usdToCoin, "USD to Coin")}</Col>
      </Row>
    </Container>
  );
};

export default CoinConversionTable;
