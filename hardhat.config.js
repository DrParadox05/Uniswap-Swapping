require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/fbYNj_RXL_8CTl9nKrJh5M0HidZfsK1L",
      },
      chainId: 137,
    }
  },
  solidity: "0.8.19",
};
