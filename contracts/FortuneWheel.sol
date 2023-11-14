// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WheelOfFortune {
    address public owner;
    uint256 public lastResult;
    uint256 public contractBalance;

    mapping(address => int256) public playerBalances;

    uint256 constant public COEFFICIENT_0_25 = 25;
    uint256 constant public COEFFICIENT_0_5 = 50;
    uint256 constant public COEFFICIENT_1 = 100;
    uint256 constant public COEFFICIENT_2 = 200;
    uint256 constant public COEFFICIENT_3 = 300;
    uint256 constant public COEFFICIENT_4 = 400;

    event BetPlaced(address indexed player, uint256 betAmount);
    event SpinResult(address indexed player, uint256 result, int256 payout);
    event FundsWithdrawn(address indexed player, uint256 amount);
    event ContractBalanceUpdated(uint256 newBalance);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 _initialContractBalance) payable {
        owner = msg.sender;
        contractBalance = _initialContractBalance;

        require(owner != address(0), "Invalid owner address");
        require(msg.value == _initialContractBalance, "Incorrect initial contract balance");
        contractBalance = _initialContractBalance;
    }

    function placeBetAndSpin(uint256 amount) external payable {
        require(amount > 0, "Bet amount must be greater than zero");
        require(playerBalances[msg.sender] >= int256(amount), "Not enough funds in the player's balance");
        require(contractBalance >= amount, "Not enough funds in the contract");

        playerBalances[msg.sender] -= int256(amount);

        emit BetPlaced(msg.sender, amount);

        // Используем хэш текущего блока и времени для генерации случайного числа
        bytes32 randomSeed = keccak256(abi.encodePacked(block.number, block.timestamp, msg.sender));
        uint256 randomResult = uint256(randomSeed) % 10;


        lastResult = randomResult;

        int256 payout = calculatePayout(randomResult, amount);
        playerBalances[msg.sender] += payout;

        // Если игрок проиграл, добавляем проигрыш на баланс контракта
        if (payout <= 0) {
            contractBalance += uint256(-payout);
        }

        emit SpinResult(msg.sender, randomResult, payout);
        emit FundsWithdrawn(msg.sender, uint256(payout));
}


    function calculatePayout(uint256 segmentNumber, uint256 betAmount) internal pure returns (int256) {
        if (segmentNumber == 0) {
            return int256(betAmount * COEFFICIENT_0_25 / 100);
        } else if (segmentNumber == 1) {
            return int256(betAmount * COEFFICIENT_0_5 / 100);
        } else if (segmentNumber == 2 || segmentNumber == 10) {
            return int256(betAmount * COEFFICIENT_1 / 100);
        } else if (segmentNumber == 8) {
            return int256(betAmount * COEFFICIENT_2 / 100);
        } else if (segmentNumber == 3 || segmentNumber == 5) {
            return int256(betAmount * COEFFICIENT_3 / 100);
        }
        else if (segmentNumber == 4) {
            return int256(betAmount * COEFFICIENT_4 / 100);
        }
        else {
            return -int256(betAmount);
        }
    }

    function withdrawFunds(uint256 withdrawAmount) external {
        uint256 playerBalance = uint256(playerBalances[msg.sender]);
        require(playerBalance >= withdrawAmount, "Not enough funds to withdraw");

        playerBalances[msg.sender] -= int256(withdrawAmount);
        payable(msg.sender).transfer(withdrawAmount);

        emit FundsWithdrawn(msg.sender, withdrawAmount);
    }

    function withdrawAllFunds() external onlyOwner {
        require(contractBalance > 0, "No funds to withdraw");

        uint256 balanceToWithdraw = contractBalance;
        contractBalance = 0;

        payable(owner).transfer(balanceToWithdraw);
        emit ContractBalanceUpdated(contractBalance);
    }

    function depositFunds() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        playerBalances[msg.sender] += int256(msg.value);
        contractBalance += msg.value;

        emit FundsWithdrawn(msg.sender, msg.value);
        emit ContractBalanceUpdated(contractBalance);
    }
}
