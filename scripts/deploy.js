const { ethers } = require("hardhat");

async function main() {
    const StateChangeMulticall = await ethers.getContractFactory("StateChangeMulticall");
    const uniswapV3RouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const stateChangeMulticall = await StateChangeMulticall.deploy(uniswapV3RouterAddress);
    await stateChangeMulticall.waitForDeployment();
    const stateChangeMulticallAddress = await stateChangeMulticall.getAddress();
    console.log("PriceDerivation Contract Address:", stateChangeMulticallAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
