// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// non-fungible tokens
contract NonFunToken is ERC721, Ownable {
  constructor() ERC721("NonFunToken", "NONFUN") {}

  // Allows minting of a new NFT 
  function mintCollectionNFT(address to, uint256 tokenId) public onlyOwner() {
    _safeMint(to, tokenId); 
  }
}
