import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../../settings/apiurl";
import { unlockAccount } from "../../js/unlockWalletAddress";

const Wallet = (props) => {
  const { web3, instance } = props;

  const [isLoadingTransactionsData, setIsLoadingTransactionsData] =
    useState(true);
  const [walletCheck, setWalletCheck] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [walletDetails, setWalletDetails] = useState([]);
  const [isSyncWallet, setIsSyncWallet] = useState(false);

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

  function formatCurrency(amount) {
    amount = parseFloat(amount);
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2) + "m";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + "k";
    } else {
      return amount.toFixed(2);
    }
  }

  const getBalance = async (web3, walletAddress) => {
    const balance = await web3.eth.getBalance(walletAddress);
    setBalance(balance);
  };

  const showWalletDetails = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    let responseAddress = "";
    try {
      const response = await axios.get(
        `${apiUrl}/wallet/getWalletAddress`,
        config
      );
      responseAddress = response.data;
    } catch (error) {
      console.log(error);
    }

    try {
      await unlockAccount(web3, responseAddress);
    } catch (error) {
      alert("Wrong Password. Try again!");
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/wallet/getWalletDetails`,
        config
      );
      setWalletDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const buyPRM = async () => {
    if (web3 && instance && walletAddress !== "") {
      const userInput = prompt(
        "Please enter the amount of PRM you want to deposit:"
      );
      const intValue = parseInt(userInput);

      if (!isNaN(intValue) && intValue > 0) {
        try {
          await unlockAccount(web3, walletAddress);
        } catch (error) {
          alert("Failed to unlock account. Please try again later.");
          return;
        }

        try {
          await instance.sendToAddress(walletAddress, intValue, {
            from: "0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42",
          });
          getBalance(web3, walletAddress);
          alert("Deposit successful.");
        } catch (error) {
          alert("Failed to deposit PRM. Please try again later.");
        }
      } else {
        alert("Invalid input. Please enter a valid positive integer.");
      }
    }
  };

  const withdraw = async () => {
    if (instance) {
      try {
        await instance.sendToAddress(walletAddress, 50000, {
          from: "0x6eBB5C18FC0fA7E211245043CF4BA6B9CA392c42",
        });
        alert("Ok");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deposit = async () => {
    if (web3 && instance && walletAddress !== "") {
      const userInput = prompt(
        "Please enter the amount of PRM you want to deposit:"
      );
      const intValue = parseInt(userInput);

      if (!isNaN(intValue) && intValue > 0) {
        try {
          await unlockAccount(web3, walletAddress);
        } catch (error) {
          alert("Failed to unlock account. Please try again later.");
          return;
        }

        try {
          await instance.deposit({
            from: walletAddress,
            value: intValue,
          });
          getBalance(web3, walletAddress);
          alert("Deposit contract successful.");
        } catch (error) {
          alert("Failed to deposit contract. Please try again later.");
        }
      } else {
        alert("Invalid input. Please enter a valid positive integer.");
      }
    }
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    const fetchWalletAndAssets = async () => {
      try {
        await axios.get(`${apiUrl}/wallet/checkWalletExist`, config);
        setWalletCheck(true);
        const response = await axios.get(`${apiUrl}/asset/getAssets`, config);
        setAssets(response.data);
      } catch (error) {
        setWalletCheck(false);
      }
    };

    fetchWalletAndAssets();
  }, [walletAddress]);

  useEffect(() => {
    const checkSameWallet = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask not detected. Please install MetaMask.");
          return;
        }

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };

        await axios
          .post(
            `${apiUrl}/wallet/isSameWallet`,
            { Value: walletAddress },
            config
          )
          .then(() => {
            setWalletAddress(walletAddress);
            setIsSyncWallet(true);
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              alert(error.response.data);
              setWalletAddress("");
              setIsSyncWallet(false);
            }
          });
      } catch (error) {
        alert("An error occurred while checking wallet.");
      }
    };

    if (walletCheck) {
      checkSameWallet();
    }
  }, [walletCheck, walletAddress]);

  useEffect(() => {
    if (instance !== null && walletAddress !== "" && isSyncWallet) {
      const fetchTransactions = async () => {
        try {
          let response = await instance.getTransactionsByWalletAddress(
            walletAddress
          );

          setTransactions(response);
          setIsLoadingTransactionsData(false);
        } catch (error) {
          console.log(error);
        }
      };

      fetchTransactions();
    }
  }, [instance, walletAddress, isSyncWallet]);

  useEffect(() => {
    if (isSyncWallet && walletAddress !== "" && web3 != null) {
      getBalance(web3, walletAddress);
    }
  }, [web3, isSyncWallet, walletAddress]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    const syncBalance = async () => {
      if (balance !== null) {
        const dataRequest = {
          Balance: balance,
        };

        try {
          await axios.post(`${apiUrl}/wallet/syncBalance`, dataRequest, config);
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (isSyncWallet && walletAddress !== "") {
      syncBalance();
    }
  }, [balance, isSyncWallet, walletAddress]);

  useEffect(() => {
    if (walletDetails.walletAddress && walletDetails.walletAddress !== "") {
      setTimeout(() => {
        setWalletDetails([]);
      }, 30000);
    }
  }, [walletDetails]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (walletAddress === "") {
        if (!window.ethereum) {
          alert("MetaMask not detected. Please install MetaMask.");
          return;
        }

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        setWalletAddress(walletAddress);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [walletAddress]);

  return (
    <>
      {walletCheck ? (
        <div className="container-fluid row d-flex justify-content-center align-items-center mt-4">
          <div className="col-8 d-flex justify-content-between p-4 border border-primary rounded">
            <div>
              <h3>Estimated Balance</h3>
              <h3>
                <b className="me-2">{formatCurrency(balance)}</b>PRM
                <button
                  className="ms-2 btn btn-success"
                  onClick={(e) => buyPRM(e)}
                >
                  +
                </button>
              </h3>
              <p className="">=${formatCurrency(balance)}</p>

              {!walletDetails.walletAddress ? (
                <a href="#" onClick={(e) => showWalletDetails(e)}>
                  Show Wallet Details
                </a>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setWalletDetails([]);
                  }}
                >
                  Hide Wallet Details
                </a>
              )}

              {walletDetails.walletAddress &&
              walletDetails.walletAddress !== "" ? (
                <div>
                  <p>Wallet Address: {walletDetails.walletAddress}</p>
                  <p>
                    {walletDetails.privateKey && walletDetails.privateKey !== ""
                      ? `Private Key: ${walletDetails.privateKey}`
                      : "The private key will only be displayed if you choose to create a new wallet beforehand."}
                  </p>
                  <span className="text-danger">
                    This will auto hidden after 30s
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <button
                className="btn btn-primary mx-1"
                onClick={() => deposit()}
              >
                deposit
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => withdraw()}
              >
                withdraw
              </button>
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
