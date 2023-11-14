WheelOfFortune Project README

Authors:

Pinchuk Yan
Igenbekov Dinmukhamed
Project Overview
The "WheelOfFortune" project is a decentralized application (DApp) implemented as a smart contract on the Ethereum blockchain using the Solidity programming language. The project simulates a game of chance where players can place bets and spin a virtual wheel. The smart contract handles various functionalities related to player balances, bets, payouts, and fund withdrawals.

Smart Contract Details
Smart Contract Name: WheelOfFortune
Solidity Version: ^0.8.19
License: MIT
Key Features:
Betting and Spinning:

Players can place bets and spin the wheel using the placeBetAndSpin function.
Pseudo-random results are generated based on block data and timestamps.
Payout Calculation:

Payouts are determined by the calculatePayout function, considering the wheel segment and bet amount.
Fund Management:

Players can withdraw funds using the withdrawFunds function.
The contract owner can withdraw all funds using the withdrawAllFunds function.
Players can deposit funds using the depositFunds function.
Frontend Implementation
The project includes a frontend component to interact with the smart contract. The frontend is not included in this repository but can be implemented using web technologies such as HTML, CSS, and JavaScript. The frontend can utilize web3 libraries to connect to the Ethereum blockchain and interact with the smart contract.

How to Use
Smart Contract Deployment:

Deploy the WheelOfFortune smart contract on the Ethereum blockchain.
Frontend Setup:

Develop a frontend interface to interact with the deployed smart contract.
Use web3 libraries to connect to the Ethereum blockchain.
Interacting with the DApp:

Players can visit the frontend to place bets, spin the wheel, and manage their balances.
The contract owner can manage and withdraw funds as needed.
Security Considerations
The project uses block data and timestamps for randomness. Consider integrating a more secure external randomness source.
Ensure the smart contract adheres to the latest Solidity version and follows best practices.