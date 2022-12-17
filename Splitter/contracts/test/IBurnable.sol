// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IBurnable
{
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
}