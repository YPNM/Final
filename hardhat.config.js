require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    //here we define all networks we will work with
    bnbtestnet: {
      url: "https://late-stylish-general.bsc-testnet.quiknode.pro/11f742175eff1008623bc79ff03d347b47020445/", //rpc from quicknode
      accounts: ["c810c70ac4f903cf6a3a03aaef5315d1fa921c5de03088ca6d5a49102a08f081"],
      chainId: 97,
    },
  },
  etherscan: {
    apiKey: "YPR2I48FBPD9VRDCQDX1B1UDY1U4YCJIV6",
  }
};
