// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Calculator {
  uint256 public calculateResult;
  
  address public user;
  
  event Add(uint256 a, uint256 b);
  
  function add(uint256 a, uint256 b) public returns (uint256) {
    calculateResult = a + b;
    assert(calculateResult >= a);
    
    emit Add(a, b);
    user = msg.sender;
    
    return calculateResult;
  }
}