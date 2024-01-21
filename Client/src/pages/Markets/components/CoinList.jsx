import { Table } from "react-bootstrap";
import CoinCard from "./CoinCard";

const CoinList = ({ coins }) => (
  <Table hover borderless style={{ width: "100%" }}>
    <tbody>
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </tbody>
  </Table>
);

export default CoinList;
