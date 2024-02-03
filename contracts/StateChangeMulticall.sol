// SPDX-License-Identifier: MIT
pragma solidity   >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract StateChangeMulticall {
    ISwapRouter public swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    struct Call {
        address target;
        bytes callData;
    }

    // Performs multiple calls and reverts all if any fail
    function multicall(Call[] memory calls) external {
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, ) = calls[i].target.call(calls[i].callData);
            require(success, "Call failed");
        }
    }

    // Example function that wraps approve and swap in one call
    function approveAndSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountOutMinimum,
        uint160 sqrtPriceLimitX96
    ) external {
        // Approve the router to spend the tokenIn
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Parameters to be passed to the swap call
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: recipient,
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: sqrtPriceLimitX96
            });

        // Execute the swap
        swapRouter.exactInputSingle(params);
    }
}
