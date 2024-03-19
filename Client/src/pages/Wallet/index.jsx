import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../../settings/apiurl";

const Wallet = (props) => {
  const { web3 } = props;

  const [walletCheck, setWalletCheck] = useState(false);

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
      Balance: 0,
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
      Balance: balance,
    };

    walletPost(data);
    setWalletCheck(true);
  };

  useEffect(() => {
    const fetchWallet = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        await axios.get(`${apiUrl}/wallet/checkWalletExist`, config);
        setWalletCheck(true);
      } catch (error) {
        setWalletCheck(false);
      }
    };

    fetchWallet();
  }, []);
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
              <div>list...</div>
            </div>
          </div>
          <div className="col-8 d-flex justify-content-between my-3 p-4 border border-primary rounded">
            <div>
              <h2>Recent Transactions</h2>
              <p>no records</p>
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
