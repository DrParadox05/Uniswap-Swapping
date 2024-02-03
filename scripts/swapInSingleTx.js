const { ethers, network } = require("hardhat");
const ERC20_ABI = require("../ABI/ERC20ABI.json");
const IUniswapV3RouterABI = require("../ABI/RouterABI.json");
const StateChangeMulticallABI = require("../artifacts/contracts/StateChangeMulticall.sol/StateChangeMulticall.json"); // ABI for your new contract
require("dotenv").config();

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Constants
const STATE_CHANGE_MULTICALL_ADDRESS = "0xE28a1b108B07C9Cfa4636165Ee7cA3927ee17797"; 
const tokenIn = "0x7e14EA29EA374d6f4FF669326C30d1faD9826026";
const tokenOut = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const chainId = 137; 
const amountIn = ethers.parseUnits("100", 6); 
const WHALE_ACCOUNT = "0x72A53cDBBcc1b9efa39c834A540550e23463AAcB";
const fee = 3000; 
const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Connect to the network
const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function main() {

  // Impersonate account 
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WHALE_ACCOUNT],
  });

  const impersonatedSigner = await ethers.getSigner(WHALE_ACCOUNT);
  const signer = wallet.connect(provider);

  // Create an instance of the StateChangeMulticall contract
  const stateChangeMulticall = new ethers.Contract(
    STATE_CHANGE_MULTICALL_ADDRESS,
    StateChangeMulticallABI.abi,
    impersonatedSigner
  );

  // Define the deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; 

  // Create the data for approveAndSwap function call
  const approveAndSwapData = stateChangeMulticall.interface.encodeFunctionData("approveAndSwap", [
    tokenIn,
    tokenOut,
    amountIn,
    fee,
    WHALE_ACCOUNT, 
    deadline,
    0, // amountOutMinimum 
    0, // sqrtPriceLimitX96 
  ]);

  // Send the transaction
  const tx = await impersonatedSigner.sendTransaction({
    to: STATE_CHANGE_MULTICALL_ADDRESS,
    data: approveAndSwapData,
  });

  console.log("Transaction submitted:", tx.hash);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
