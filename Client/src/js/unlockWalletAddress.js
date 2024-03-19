export const unlockAccount = async (web3, walletAddress) => {
  if (web3 != null) var password = prompt("Please enter your wallet password");
  await web3.eth.personal.unlockAccount(walletAddress, password, 0);
};
