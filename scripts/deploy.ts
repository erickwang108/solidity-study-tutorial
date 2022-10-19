const { ethers } = require("hardhat");

async function main() {
  // Get the contract owner
  const contractOwner = await ethers.getSigners();
  console.log(`Deploying contract from: ${contractOwner[0].address}`);

  // Hardhat helper to get the ethers contractFactory object
  const NonFunToken = await ethers.getContractFactory("NonFunToken");

  // Deploy the contract
  console.log("Deploying NonFunToken...");
  const nonFunToken = await NonFunToken.deploy();
  await nonFunToken.deployed();
  console.log(`NonFunToken deployed to: ${nonFunToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
