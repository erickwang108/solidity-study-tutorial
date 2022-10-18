// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Storage {
  uint public value;

  constructor(uint v) {
    value = v;
  }

  function setValue(uint v) public {
    value = v;
  }
}