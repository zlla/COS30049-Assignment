// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.16 <0.9.0;

pragma experimental ABIEncoderV2;

contract ProMinTrader {
    struct Transaction {
        uint256 id;
        address walletAddress;
        string coinId;
        uint256 amount;
        uint256 totalPrice;
        uint256 timestamp;
        string transactionType;
    }

    Transaction[] public transactions;
    uint256 public transactionCount;

    mapping(address => uint256[]) private transactionsByAddress; // Mapping from address to array of transaction IDs

    mapping(address => uint256) public balances;

    constructor() public payable {
        balances[msg.sender] += msg.value;
    }

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
        require(
            address(this).balance >= _amount,
            "Insufficient balance in the contract"
        );
        _recipient.transfer(_amount);
    }

    function addTransaction(
        address payable _walletAddress,
        string memory _coinId,
        uint256 _amount,
        uint256 _totalPrice,
        string memory _transactionType
    ) public payable {
        uint256 currentTime = block.timestamp;
        transactions.push(
            Transaction(
                transactionCount,
                _walletAddress,
                _coinId,
                _amount,
                _totalPrice,
                currentTime,
                _transactionType
            )
        );
        transactionsByAddress[_walletAddress].push(transactionCount); // Update mapping
        transactionCount++;

        if (keccak256(abi.encodePacked(_transactionType)) == keccak256(abi.encodePacked("buy"))) {
                require(msg.value >= _totalPrice, "Insufficient payment");
            
                if (msg.value > _totalPrice) {
                    msg.sender.transfer(msg.value - _totalPrice);
                }
            }
        else if (keccak256(abi.encodePacked(_transactionType)) == keccak256(abi.encodePacked("sell"))) {
            require(_totalPrice <= address(this).balance, "Insufficient balance in contract");
            _walletAddress.transfer(_totalPrice);
        }
    }

    function getTransactionById(uint256 _transactionId) public view returns (Transaction memory) {
        require(_transactionId < transactions.length, "Transaction ID does not exist");
        return transactions[_transactionId];
    }
    
    function getIdTransactionsByAddress(address _walletAddress) public view returns (uint256[] memory) {
        return transactionsByAddress[_walletAddress];
    }

    function getTransactionsByWalletAddress(address _walletAddress) public view returns (Transaction[] memory) {
        uint256[] memory transactionIds = getIdTransactionsByAddress(_walletAddress);
        Transaction[] memory userTransactions = new Transaction[](transactionIds.length);

        for (uint256 i = 0; i < transactionIds.length; i++) {
            userTransactions[i] = transactions[transactionIds[i]];
        }

        return userTransactions;
    }

}

