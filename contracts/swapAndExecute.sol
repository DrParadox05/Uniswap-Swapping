// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

// contract Swapper {
//     ISwapRouter public immutable swapRouter;

//     constructor(ISwapRouter _swapRouter) {
//         swapRouter = _swapRouter;
//     }

//     function permitAndSwap(
//         address tokenIn,
//         address tokenOut,
//         uint24 fee,
//         address recipient,
//         uint256 deadline,
//         uint256 amountIn,
//         uint256 amountOutMinimum,
//         uint160 sqrtPriceLimitX96,
//         uint8 v,
//         bytes32 r,
//         bytes32 s
//     ) external {
//         // Execute permit to approve the Swapper contract to spend the tokens
//         IERC20Permit(tokenIn).permit(msg.sender, address(this), amountIn, deadline, v, r, s);

//         // Parameters to be passed to the swap call
//         ISwapRouter.ExactInputSingleParams memory params =
//             ISwapRouter.ExactInputSingleParams({
//                 tokenIn: tokenIn,
//                 tokenOut: tokenOut,
//                 fee: fee,
//                 recipient: recipient,
//                 deadline: deadline,
//                 amountIn: amountIn,
//                 amountOutMinimum: amountOutMinimum,
//                 sqrtPriceLimitX96: sqrtPriceLimitX96
//             });

//         // Execute the swap
//         swapRouter.exactInputSingle(params);
//     }
// }