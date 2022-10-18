// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Storage.sol";

contract Machine {
  uint public calculateResult;
  address public user;
  Storage public s;

  event AddedValuesByDelegateCall(uint256 a, uint256 b, bool success);
  event AddedValuesByCall(uint256 a, uint256 b, bool success);

  constructor(Storage addr) {
    s = addr;
    calculateResult = 0;
  }
  
  function saveValue(uint x) public returns (bool) {
    s.setValue(x);
    return true;
  }

  function getValue() public view returns (uint) {
    return s.value();
  }

  function getCalResult() public view returns (uint) {
    return calculateResult;
  }

  function addValuesWithDelegateCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
    (bool success, bytes memory result) = calculator.delegatecall(abi.encodeWithSignature("add(uint256,uint256)", a, b));
    emit AddedValuesByDelegateCall(a, b, success);
    return abi.decode(result, (uint256));
  }
    
  function addValuesWithCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
    (bool success, bytes memory result) = calculator.call(abi.encodeWithSignature("add(uint256,uint256)", a, b));
    emit AddedValuesByCall(a, b, success);
    return abi.decode(result, (uint256));
  }
}