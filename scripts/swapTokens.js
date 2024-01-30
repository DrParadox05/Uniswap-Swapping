const { ethers } = require("hardhat");
const {
  Pool,
  Route,
} = require("@uniswap/v3-sdk");
const {
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} = require("@uniswap/sdk-core");
const PoolABI = require("../ABI/poolABI.json");
const ERC20_ABI = require("../ABI/ERC20ABI.json");
const IUniswapV3RouterABI = require("../ABI/RouterABI.json");
require("dotenv").config();

// Load environment variables
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Define the network and contract details
const chainId = 137;

// Connect to the network
const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);

// Create a wallet instance
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Helper Function Variables
const amountIn = ethers.parseUnits("100", 6).toString();

// Define getTokenTransferApproval Function
async function getTokenTransferApproval(token) {
  const address = WALLET_ADDRESS;
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  const tokenContract = new ethers.Contract(
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    ERC20_ABI,
    provider
  );

  // Connect the contract instance to the signer
  const tokenContractWithSigner = tokenContract.connect(wallet);

  const transaction = await tokenContractWithSigner.approve(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    ethers.parseUnits("100", 6).toString()
  );

  const transactionResponse = await wallet.sendTransaction({
    to: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    data: transaction.data,
    // Add any other transaction parameters you need
  });

  const receipt = await transactionResponse.wait();
  console.log("Transaction receipt:", receipt);

  console.log("getTokenTransferApproval function works succeddfully");

}

async function main() {
  // Connect to the network
  const [deployer] = await ethers.getSigners(); 

  // Addresses for MATIC and USDT on Polygon
  const MATIC = new Token(
    137,
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    6,
    "WMATIC",
    "Wrapped Matic"
  );
  const USDT = new Token(
    137,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    6,
    "USDT",
    "Tether USD"
  );

  // WMATIC Contract
  const wmaticContract = new ethers.Contract(
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    ERC20_ABI,
    deployer
  );

  // Deposit MATIC and get WMATIC
  const maticAmountToWrap = ethers.parseEther("100")// 100 MATIC
  await wmaticContract.deposit({ value: maticAmountToWrap });
  console.log(`Wrapped ${maticAmountToWrap.toString()} MATIC to WMATIC`);

  // Approve the Uniswap router to spend your WMATIC
  const uniswapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  await wmaticContract.approve(uniswapRouterAddress, maticAmountToWrap);
  console.log(
    `Approved Uniswap Router to spend ${maticAmountToWrap.toString()} WMATIC`
  );

  // Create instances of the tokens
  const matic = MATIC;
  const usdt = USDT;

  const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);

  // Get pool information
  const slot0 = await poolContract.slot0();
  // const sqrtPriceX96 = JSBI.BigInt(slot0.sqrtPriceX96.toString());
  const sqrtPriceX96 = slot0.sqrtPriceX96;
  const tick = slot0.tick;
  const fee = await poolContract.fee();
  const liquidity = await poolContract.liquidity();

  // Define the trade parameters
  const amountToBeSwapped = CurrencyAmount.fromRawAmount(
    matic,
    ethers.parseUnits("100", 6).toString() // Convert 100 MATIC to the smallest unit with 18 decimal places
  );
  const slippageTolerance = new Percent("50", "10000"); // 0.50%
  const recipient = deployer.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

  // Determine the trade route
  const swapRoute = new Route([pool], matic, usdt);

  // Executing the Trade
  await getTokenTransferApproval(matic);

  const swapRouterContract = new ethers.Contract(
    uniswapRouterAddress,
    IUniswapV3RouterABI,
    wallet
  );

  console.log("AMOINT IN: ", amountIn);

  const swapParams = {
    tokenIn: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    tokenOut: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    fee: 3000,
    recipient: recipient,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  // const connectWithSigner = swapRouterContract.connect(wallet);

  const tx = await swapRouterContract.connect(deployer).exactInputSingle(swapParams, {
    gasPrice: ethers.parseUnits("60", "gwei"),
  });

  console.log("Transaction submitted:", tx.hash);

  const receipt = await tx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
