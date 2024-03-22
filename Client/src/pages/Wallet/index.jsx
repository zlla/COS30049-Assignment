import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../../settings/apiurl";

const Wallet = (props) => {
  const { web3, instance } = props;

  const [isLoadingTransactionsData, setIsLoadingTransactionsData] =
    useState(true);
  const [walletCheck, setWalletCheck] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);

  const walletPost = async (data) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    try {
      await axios.post(`${apiUrl}/wallet/createNewWallet`, data, config);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewWallet = async (e) => {
    e.preventDefault();

    // Create a new random private key
    const randomPrivateKey = ethers.Wallet.createRandom().privateKey;
    const privateKeyWithoutPrefix = randomPrivateKey.substring(2); // Remove '0x' prefix
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(randomPrivateKey);

    const data = {
      UserId: 0,
      WalletAddress: wallet.address,
      PrivateKey: privateKeyWithoutPrefix,
      Balance: "0",
    };

    walletPost(data);

    try {
      let password = prompt("Please enter your wallet password");
      await web3.eth.personal.importRawKey(privateKeyWithoutPrefix, password);

      setWalletCheck(true);
      // Unlock the account
      // await web3.eth.personal.unlockAccount(wallet.address, password, 0);
    } catch (error) {
      console.log(error);
    }
  };

  const syncWallet = async (e) => {
    e.preventDefault();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const walletAddress = accounts[0];
    const balance = await web3.eth.getBalance(walletAddress);

    const data = {
      UserId: 0,
      WalletAddress: walletAddress,
      PrivateKey: "",
      Balance: balance.toString(),
    };

    walletPost(data);
    setWalletCheck(true);
  };

  function convertUnixTimestamp(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    var unixTimestampInMillis = unixTimestamp * 1000;

    // Create a new Date object with the Unix timestamp
    var date = new Date(unixTimestampInMillis);

    // Get the components of the date
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Month starts from 0
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Format the components if needed (add leading zeros if necessary)
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Construct the formatted date string
    var formattedDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    return formattedDate;
  }

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    const fetchWallet = async () => {
      try {
        await axios.get(`${apiUrl}/wallet/checkWalletExist`, config);
        setWalletCheck(true);
      } catch (error) {
        setWalletCheck(false);
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/asset/getAssets`, config);
        setAssets(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWallet();
    fetchAssets();
  }, []);

  useEffect(() => {
    if (instance != null) {
      const fetchTransactions = async () => {
        try {
          let response = await instance.getTransactionsByWalletAddress(
            "0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42"
          );

          setTransactions(response);
          setIsLoadingTransactionsData(false);
        } catch (error) {
          console.log(error);
        }
      };

      fetchTransactions();
    }
  }, [instance]);

  return (
    <>
      {walletCheck ? (
        <div className="container-fluid row d-flex justify-content-center align-items-center mt-4">
          <div className="col-8 d-flex justify-content-between p-4 border border-primary rounded">
            <div>
              <h3>Estimated Balance</h3>
              <h3>
                <b className="me-2">0.00</b>PRM
              </h3>
              <p className="">=$0.00</p>
            </div>
            <div>
              <button className="btn btn-primary mx-1">deposit</button>
              <button className="btn btn-primary mx-1">withdraw</button>
              <button className="btn btn-primary mx-1">transfer</button>
            </div>
          </div>
          <div className="col-8 d-flex justify-content-between my-3 p-4 border border-primary rounded">
            <div>
              <h2>My Assets</h2>
              <p>Coin View</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Wallet ID</th>
                    <th>Coin ID</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.walletId}</td>
                      <td>{item.coinId}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-8 d-flex justify-content-between my-3 p-4 border border-primary rounded">
            <div>
              <h2>Recent Transactions</h2>
              {isLoadingTransactionsData ? (
                <p>Loading ...</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Coin ID</th>
                      <th>Amount</th>
                      <th>Timestamp</th>
                      <th>Transaction Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => {
                      return (
                        <tr key={index}>
                          <td>{transaction.id}</td>
                          <td>{transaction.coinId}</td>
                          <td>{transaction.amount}</td>
                          <td>{convertUnixTimestamp(transaction.timestamp)}</td>
                          <td>{transaction.transactionType}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container-fluid row d-flex justify-content-center align-items-center mt-4">
          <div className="col-8 d-flex justify-content-around my-3 p-4 border border-primary rounded">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => syncWallet(e)}
            >
              Sync Wallet with Current Wallet in Metamask
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => createNewWallet(e)}
            >
              Create new Wallet
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallet;
