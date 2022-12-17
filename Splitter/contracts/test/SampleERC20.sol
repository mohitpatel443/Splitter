// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SampleERC20 is ERC20, ERC20Burnable
{
    /** 
     * @dev Calls ERC20 constructor and takes name and symbol of token as input
     * @dev Mints total Supply into Admin's Account
     */
    constructor() ERC20("Sample1", "SMPL1")
    {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

}   