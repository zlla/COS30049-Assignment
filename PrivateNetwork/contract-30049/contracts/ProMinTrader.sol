// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.16 <0.9.0;

contract ProMinTrader {
    struct Transaction {
        uint256 id;
        address walletAddress;
        uint256 coinId;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public transactions;
    uint256 public transactionCount;

    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        (msg.sender).transfer(_amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function sendToAddress(address payable _recipient, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= _amount, "Insufficient balance in the contract");
        _recipient.transfer(_amount);
    }

    function addTransaction(
        address _walletAddress,
        uint256[] memory _coinIds,
        uint256 _amount
    ) public payable {
        require(msg.value >= _amount, "Insufficient payment");
        uint256 currentTime = block.timestamp;
        for (uint256 i = 0; i < _coinIds.length; i++) {
            transactions.push(
                Transaction(
                    transactionCount,
                    _walletAddress,
                    _coinIds[i],
                    _amount,
                    currentTime
                )
            );
            transactionCount++;
        }
        if (msg.value > _amount) {
            msg.sender.transfer(msg.value - _amount);
        }
    }

    function getTransaction(uint256 _transactionId) public view returns (
        uint256 id,
        address walletAddress,
        uint256 coinId,
        uint256 amount,
        uint256 timestamp
    ) {
        require(_transactionId < transactions.length, "Transaction ID does not exist");
        
        Transaction memory transaction = transactions[_transactionId];
        
        id = transaction.id;
        walletAddress = transaction.walletAddress;
        coinId = transaction.coinId;
        amount = transaction.amount;
        timestamp = transaction.timestamp;
    }

    function getTransactionsByAddress(address _walletAddress) public view returns (
        uint256[] memory ids,
        uint256[] memory coinIds,
        uint256[] memory amounts,
        uint256[] memory timestamps
    ) {
        uint256 count = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].walletAddress == _walletAddress) {
                count++;
            }
        }
        
        ids = new uint256[](count);
        coinIds = new uint256[](count);
        amounts = new uint256[](count);
        timestamps = new uint256[](count);
        
        uint256 index = 0;
        for (uint256 j = 0; j < transactions.length; j++) {
            if (transactions[j].walletAddress == _walletAddress) {
                ids[index] = transactions[j].id;
                coinIds[index] = transactions[j].coinId;
                amounts[index] = transactions[j].amount;
                timestamps[index] = transactions[j].timestamp;
                index++;
            }
        }
    }
}
