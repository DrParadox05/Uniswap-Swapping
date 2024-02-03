// const { ethers, network, hre } = require("hardhat");
// const ERC20_ABI = require("../ABI/ERC20ABI.json");
// const IUniswapV3RouterABI = require("../ABI/RouterABI.json");
// const MULTICALL_ABI = require("../ABI/MultiCallABI.json");
// require("dotenv").config();

// // Load environment variables
// const RPC_URL = process.env.RPC_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

// // Constants
// const SWAPPER_CONTRACT_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
// const tokenIn = "0x7e14EA29EA374d6f4FF669326C30d1faD9826026";
// const chainId = 137;
// const amountIn = ethers.parseUnits("100", 6);
// const WHALE_ACCOUNT = "0x72A53cDBBcc1b9efa39c834A540550e23463AAcB";
// const tokenOut = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
// const fee = 3000;
// const MULTICALL_ADDRESS = "0xa1B2b503959aedD81512C37e9dce48164ec6a94d";

// // Connect to the network
// const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
// const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// async function main() {
//   // Impersonate account
//   await network.provider.request({
//     method: "hardhat_impersonateAccount",
//     params: [WHALE_ACCOUNT],
//   });

//   // const impersonatedSigner = provider.getSigner(WHALE_ACCOUNT)
// //   const impersonatedSigner = await ethers.provider.getSigner(WHALE_ACCOUNT);
//   const impersonatedSigner = await ethers.getSigner(WHALE_ACCOUNT);



// //   console.log("IMP SIGNER: ", impersonatedSigner);
// //   console.log("------------------------------------------------------------------");

//   // USDC Contract
//   const usdcContract = new ethers.Contract(
//     tokenIn,
//     ERC20_ABI,
//     impersonatedSigner
//   );
// //   console.log("usdcContract: ", usdcContract);
// //   console.log("------------------------------------------------------------------");

//   const multicall = new ethers.Contract(
//     MULTICALL_ADDRESS,
//     MULTICALL_ABI,
//     impersonatedSigner
//   );
// //   console.log("multicall: ", multicall);
// //   console.log("------------------------------------------------------------------");

//   const routerContract = new ethers.Contract(
//     SWAPPER_CONTRACT_ADDRESS,
//     IUniswapV3RouterABI,
//     impersonatedSigner
//   );

//   const currentAllowance = await usdcContract.allowance(WHALE_ACCOUNT, SWAPPER_CONTRACT_ADDRESS);
// console.log(`Current Allowance: ${currentAllowance.toString()}`);

// //   console.log("routerContract: ", routerContract);
// //   console.log("------------------------------------------------------------------");

//   //   // Create instance of Batch.sol
//   //   const batchAddress = "";
//   //   const batch = await ethers.getContractAt("Batch", batchAddress);

// //   const accountBalanceWhale = await usdcContract.connect(impersonatedSigner).balanceOf(WHALE_ACCOUNT);
// //   console.log("Whale USDC account balance:", accountBalanceWhale);

// //   const nonces = await usdcContract.nonces(impersonatedSigner.address);
//   const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

//   // Define approval and swap data
//   const approveData = usdcContract.interface.encodeFunctionData("approve", [
//     SWAPPER_CONTRACT_ADDRESS,
//     amountIn,
//   ], {gasPrice: ethers.parseUnits("70", "gwei")}
//   );

//   const swapParams = {
//     tokenIn: tokenIn,
//     tokenOut: tokenOut,
//     fee: fee,
//     recipient: WHALE_ACCOUNT,
//     deadline: deadline,
//     amountIn: amountIn,
//     amountOutMinimum: 0,
//     sqrtPriceLimitX96: 0,
//   };

//   const swapData = routerContract.interface.encodeFunctionData(
//     "exactInputSingle",
//     [swapParams],
//     {gasPrice: ethers.parseUnits("70", "gwei")}
//   );

//   console.log("Approve Data: ", approveData);
//   console.log("Swap Data: ", swapData);

//   const icurrentAllowance = await usdcContract.allowance(WHALE_ACCOUNT, SWAPPER_CONTRACT_ADDRESS);
// console.log(`iiiiCurrent Allowance: ${icurrentAllowance.toString()}`);
// //   // Aggregate transactions
// //   const tx = await multicall.aggregate([
// //     {
// //       target: tokenIn,
// //       callData: approveData,
// //     },
// //     {
// //       target: SWAPPER_CONTRACT_ADDRESS,
// //       callData: swapData,
// //     },
// //   ]);

// //   console.log("Transaction submitted:", tx.hash);

// //   const receipt = await tx.wait();
// //   console.log(`Transaction was mined in block ${receipt.blockNumber}`);

// try {
//     const tx = await multicall.aggregate([
//       {
//         target: tokenIn,
//         callData: approveData,
//       },
//       {
//         target: SWAPPER_CONTRACT_ADDRESS,
//         callData: swapData,
//       },
//     ]);
  
//     console.log("Transaction submitted:", tx.hash);
  
//     const receipt = await tx.wait();
//     console.log(`Transaction was mined in block ${receipt.blockNumber}`);
//   } catch (error) {
//     console.error("Transaction failed:", error);
//   }
  





//   // Connect the contract instance to the signer
//   //   const UniswapV3Router = tokenContract.connect(wallet);

//   //   const approvalCallData = await IUniswapV3RouterABI.encodeFunctionData(
//   //     "approve",
//   //     [SWAPPER_CONTRACT_ADDRESS, ethers.parseUnits("100", 6).toString()]
//   //   );

//   //   // Access the interface of the Uniswap V2 router contract instance to get the encoded call data for the swap
//   //   const swapCallData = IUniswapV3RouterABI.encodeFunctionData(
//   //     "exactInputSingle",
//   //     [tokenIn, tokenOut, fee, WHALE_ACCOUNT, deadline, amountIn, 0, 0]
//   //   );

//   //   // Assemble and send the batch transaction
//   //   const batchAll = await batch.batchAll(
//   //     [tokenIn, SWAPPER_CONTRACT_ADDRESS],
//   //     [], // value of the native token to send
//   //     [approvalCallData, swapCallData], // call data
//   //     [] // gas limit
//   //   );

//   //   await batchAll.wait();
//   //   console.log(`Approve and swap ERTH tokens for DEV tokens: ${batchAll.hash}`);

//   //   // Create the signature for permit
//   //   const domain = {
//   //     name: 'USDC',
//   //     version: '1',
//   //     chainId: chainId,
//   //     verifyingContract: tokenIn
//   //   };

//   //   const types = {
//   //     Permit: [
//   //       { name: 'owner', type: 'address' },
//   //       { name: 'spender', type: 'address' },
//   //       { name: 'value', type: 'uint256' },
//   //       { name: 'nonce', type: 'uint256' },
//   //       { name: 'deadline', type: 'uint256' }
//   //     ]
//   //   };

//   //   const value = {
//   //     owner: impersonatedSigner.address,
//   //     spender: SWAPPER_CONTRACT_ADDRESS,
//   //     value: amountIn,
//   //     // value: amountIn.toString(),
//   //     nonce: nonces,
//   //     deadline: deadline
//   //   };

//   //   const signature = await impersonatedSigner.signTypedData(domain, types, value);
//   //   const sig  = ethers.splitSignature(signature);

//   // verify the Permit type data with the signature
//   //   const recovered = ethers.verifyTypedData(
//   //     domain,
//   //     types,
//   //     value,
//   //     sig
//   //   );

//   //   // get network gas price
//   //   gasPrice = await provider.getGasPrice();

//   //   // Call permitAndSwap on the Swapper contract
//   //   const tx = await swapper
//   //     .connect(impersonatedSigner)
//   //     .permitAndSwap(
//   //       usdcContract.address,
//   //       "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
//   //       3000,
//   //       impersonatedSigner,
//   //       amountIn,
//   //       0,
//   //       0,
//   //       sig.v,
//   //       sig.r,
//   //       sig.s,
//   //       {
//   //         gasPrice: gasPrice,
//   //         // gasLimit: 800000
//   //       }
//   //     );

// //   console.log("Transaction submitted:", tx.hash);

// //   const receipt = await tx.wait();
// //   console.log(`Transaction was mined in block ${receipt.blockNumber}`);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
// });
