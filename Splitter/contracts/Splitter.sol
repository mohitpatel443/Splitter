// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "./interfaces.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC20Burnable
    {
        function burn(uint256 amount) external;
    }

contract Splitter is Ownable
{
    IERC20 public BUSD;

    address public _burnAddress = 0x000000000000000000000000000000000000dEaD;

    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Burnable;
    
    IUniswapV2Router02 public uniswapV2Router;

    event Split(
        address _account1,
        uint256 busdAmount,
        address _token,
        uint256 burnAmount
    );
    
    constructor(address _router, address _BUSD)
    {
        BUSD = IERC20(_BUSD);
        uniswapV2Router = IUniswapV2Router02(_router);
    }
    
    function split(address _account1, uint256 amount, address _token, bool burnFunction) public
    {

        require(_account1 != address(0), "Invalid address");
        require(_token != address(0), "Invalid address");
        require(amount > 1 ether , "Invalid amount");

        // 1 busd to bnb
        BUSD.safeTransferFrom(msg.sender, address(this), amount);

        swapTokensForETH(1 ether, address(this));

        amount = amount - 1 ether;
 
        //half busd to account 1
        uint256 busdAmount = amount/2;


        BUSD.safeTransferFrom(msg.sender, _account1, busdAmount);

        uint256 beforeTokenBalance = IERC20(_token).balanceOf(address(this));
       
        swapTokensForTokens(busdAmount, address(this), _token);

        uint256 afterTokenBalance = IERC20(_token).balanceOf(address(this));


        uint256 burnAmount = afterTokenBalance - beforeTokenBalance;

        if (burnFunction == true){
            if (burnAmount > 0) 
            {
                IERC20Burnable(_token).burn(burnAmount);
            }
        }
        else{

            if (burnAmount > 0) 
            {
              
               IERC20(_token).safeTransfer(_burnAddress,burnAmount); 
            }
            }

        emit Split(_account1,busdAmount,_token,burnAmount);
    }

    function setRouterAddress(address newRouter) external onlyOwner 
    {
        require(newRouter != address(uniswapV2Router));
        require(newRouter != address(0), "Invalid address");
        uniswapV2Router = IUniswapV2Router02(newRouter);
    }

    function ChangeBUSDAddress(address newAddress) public virtual onlyOwner 
    {
        require(newAddress != address(0), "Invalid address");
        BUSD = IERC20(newAddress);
    }

    
    function withdraw(uint256 weiAmount, address to) external onlyOwner
    {
        require(address(this).balance >= weiAmount, "insufficient BNB balance");
        (bool sent, ) = payable(to).call{value: weiAmount}("");
        require(sent, "Failed to withdraw");
    }

    function swapTokensForETH(uint256 tokenAmount, address to   ) private 
    {
        // generate the uniswap pair path of token -> wbnb
        address[] memory path = new address[](2);
        path[0] = address(BUSD);
        path[1] = uniswapV2Router.WETH();

        BUSD.approve(address(uniswapV2Router), tokenAmount);
 
        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens
        (
            tokenAmount,
            0, // accept any amount of BNB
            path,   
            to,
            block.timestamp
        );
    }

    function swapTokensForTokens(uint256 tokenAmount, address to, address _token) private 
    {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(BUSD);
        path[1] = _token;

        BUSD.approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens
        (
            tokenAmount,
            0, // accept any amount of BUSD
            path,
            to,
            block.timestamp
        );
    }

    receive () external payable {}
}