// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract FunToken is ERC20 {
  uint256 constant initialSupply = 1000000 * (10**18);
  
  constructor() ERC20("FunToken", "FUN") {
    _mint(msg.sender, initialSupply);
  }
}
