import { expect } from "chai";
import { ethers } from "hardhat";

const { parseUnits } = ethers.utils;

describe("FunToken", function () {
  before(async function () {
    this.FunToken = await ethers.getContractFactory("FunToken");
  });

  beforeEach(async function () {
    this.funToken = await this.FunToken.deploy();
    const [owner, recipient] = await ethers.getSigners();
    this.decimals = await this.funToken.decimals();
    this.ownerAddress = owner.address;
    this.recipientAddress = recipient.address;
    this.signerContract = this.funToken.connect(recipient);
  });

  it("Creates a token with a name", async function () {
    expect(await this.funToken.name()).to.exist;
  });

  it("Creates a token with a symbol", async function () {
    expect(await this.funToken.symbol()).to.exist;
  });

  it("Has a valid decimal", async function () {
    expect((await this.funToken.decimals()).toString()).to.equal("18");
  });

  it("Has a valid total supply", async function () {
    const expectedSupply = parseUnits("1000000", this.decimals);
    expect((await this.funToken.totalSupply()).toString()).to.equal(
      expectedSupply
    );
  });

  it("Is able to query account balances", async function () {
    const ownerBalance = await this.funToken.balanceOf(this.ownerAddress);
    expect(await this.funToken.balanceOf(this.ownerAddress)).to.equal(
      ownerBalance
    );
  });

  it("Transfers the right amount of tokens to/from an account", async function () {
    const transferAmount = 1000;
    await expect(
      this.funToken.transfer(this.recipientAddress, transferAmount)
    ).to.changeTokenBalances(
      this.funToken,
      [this.ownerAddress, this.recipientAddress],
      [-transferAmount, transferAmount]
    );
  });

  it("Emits a transfer event with the right arguments", async function () {
    const transferAmount = 1000;
    await expect(
      this.funToken.transfer(
        this.recipientAddress,
        parseUnits(transferAmount.toString(), this.decimals)
      )
    )
      .to.emit(this.funToken, "Transfer")
      .withArgs(
        this.ownerAddress,
        this.recipientAddress,
        parseUnits(transferAmount.toString(), this.decimals)
      );
  });

  it("Allows for allowance approvals and queries", async function () {
    const approveAmount = 10000;
    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(approveAmount.toString(), this.decimals)
    );
    expect(
      await this.funToken.allowance(this.recipientAddress, this.ownerAddress)
    ).to.equal(parseUnits(approveAmount.toString(), this.decimals));
  });

  it("Emits an approval event with the right arguments", async function () {
    const approveAmount = 10000;
    await expect(
      this.signerContract.approve(
        this.ownerAddress,
        parseUnits(approveAmount.toString(), this.decimals)
      )
    )
      .to.emit(this.funToken, "Approval")
      .withArgs(
        this.recipientAddress,
        this.ownerAddress,
        parseUnits(approveAmount.toString(), this.decimals)
      );
  });

  it("Allows an approved spender to transfer from owner", async function () {
    const transferAmount = 10000;
    await this.funToken.transfer(
      this.recipientAddress,
      parseUnits(transferAmount.toString(), this.decimals)
    );
    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(transferAmount.toString(), this.decimals)
    );
    await expect(
      this.funToken.transferFrom(
        this.recipientAddress,
        this.ownerAddress,
        transferAmount
      )
    ).to.changeTokenBalances(
      this.funToken,
      [this.ownerAddress, this.recipientAddress],
      [transferAmount, -transferAmount]
    );
  });

  it("Emits a transfer event with the right arguments when conducting an approved transfer", async function () {
    const transferAmount = 10000;
    await this.funToken.transfer(
      this.recipientAddress,
      parseUnits(transferAmount.toString(), this.decimals)
    );
    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(transferAmount.toString(), this.decimals)
    );
    await expect(
      this.funToken.transferFrom(
        this.recipientAddress,
        this.ownerAddress,
        parseUnits(transferAmount.toString(), this.decimals)
      )
    )
      .to.emit(this.funToken, "Transfer")
      .withArgs(
        this.recipientAddress,
        this.ownerAddress,
        parseUnits(transferAmount.toString(), this.decimals)
      );
  });

  it("Allows allowance to be increased and queried", async function () {
    const initialAmount = 100;
    const incrementAmount = 10000;

    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(initialAmount.toString(), this.decimals)
    );
    const previousAllowance = await this.funToken.allowance(
      this.recipientAddress,
      this.ownerAddress
    );
    await this.signerContract.increaseAllowance(
      this.ownerAddress,
      parseUnits(incrementAmount.toString(), this.decimals)
    );
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).add(
      ethers.BigNumber.from(
        parseUnits(incrementAmount.toString(), this.decimals)
      )
    );
    expect(
      await this.funToken.allowance(this.recipientAddress, this.ownerAddress)
    ).to.equal(expectedAllowance);
  });

  it("Emits approval event when allowance is increased", async function () {
    const incrementAmount = 10000;
    await expect(
      this.signerContract.increaseAllowance(
        this.ownerAddress,
        parseUnits(incrementAmount.toString(), this.decimals)
      )
    )
      .to.emit(this.funToken, "Approval")
      .withArgs(
        this.recipientAddress,
        this.ownerAddress,
        parseUnits(incrementAmount.toString(), this.decimals)
      );
  });

  it("Allows allowance to be decreased and queried", async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(initialAmount.toString(), this.decimals)
    );
    const previousAllowance = await this.funToken.allowance(
      this.recipientAddress,
      this.ownerAddress
    );
    await this.signerContract.decreaseAllowance(
      this.ownerAddress,
      parseUnits(decrementAmount.toString(), this.decimals)
    );
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).sub(
      ethers.BigNumber.from(
        parseUnits(decrementAmount.toString(), this.decimals)
      )
    );
    expect(
      await this.funToken.allowance(this.recipientAddress, this.ownerAddress)
    ).to.equal(expectedAllowance);
  });

  it("Emits approval event when allowance is decreased", async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(
      this.ownerAddress,
      parseUnits(initialAmount.toString(), this.decimals)
    );
    const expectedAllowance = ethers.BigNumber.from(
      parseUnits(initialAmount.toString(), this.decimals)
    ).sub(
      ethers.BigNumber.from(
        parseUnits(decrementAmount.toString(), this.decimals)
      )
    );
    await expect(
      this.signerContract.decreaseAllowance(
        this.ownerAddress,
        parseUnits(decrementAmount.toString(), this.decimals)
      )
    )
      .to.emit(this.funToken, "Approval")
      .withArgs(this.recipientAddress, this.ownerAddress, expectedAllowance);
  });
});
