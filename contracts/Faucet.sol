// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "./TestUSDC.sol";


contract Faucet {
TestUSDC public token;
uint256 public dripAmount = 100 * 10**6; // 100 tUSDC (6 decimals if you want)
uint256 public cooldown = 1 hours;


mapping(address => uint256) public lastDrip;


constructor(address tokenAddress) {
token = TestUSDC(tokenAddress);
}


function requestTokens() external {
require(block.timestamp - lastDrip[msg.sender] >= cooldown, "Try again later");
lastDrip[msg.sender] = block.timestamp;
token.mint(msg.sender, dripAmount);
}
}