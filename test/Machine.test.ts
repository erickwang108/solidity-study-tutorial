import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "./constants";

describe("DelegateCall Machine", function () {
  async function deployMachineFixture() {
    const Machine = await ethers.getContractFactory("Machine");
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy(0);
    const machine = await Machine.deploy(storage.address);

    return { machine };
  }

  async function deployMachineFixture2() {
    const [owner, otherAccount] = await ethers.getSigners();
    const Machine = await ethers.getContractFactory("Machine");
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy(0);
    const Calculator = await ethers.getContractFactory("Calculator");
    const calculator = await Calculator.deploy();
    const machine = await Machine.deploy(storage.address);
    return { machine, calculator, owner, otherAccount };
  }

  describe("#saveValue", function () {
    it("should successfully save value", async function () {
      const { machine } = await loadFixture(deployMachineFixture);
      await machine.saveValue(54);
      expect(await machine.getValue()).to.equal(54);
    });
  });

  describe("#addValuesWithCall()", function () {
    it("should successfully add values with call", async () => {
      const { owner, machine, calculator } = await loadFixture(
        deployMachineFixture2
      );
      const result = await machine.addValuesWithCall(calculator.address, 1, 2);
      await expect(result)
        .to.emit(machine, "AddedValuesByCall")
        .withArgs(1, 2, true);
      expect(result.from).to.equal(owner.address);
      expect(result.to).to.equal(machine.address);
      expect(await calculator.calculateResult()).to.equal(3);
      expect(await machine.getCalResult()).to.equal(0);
      expect(await machine.user()).to.equal(ZERO_ADDRESS);
      expect(await calculator.user()).be.equal(machine.address);
    });
  });

  describe("#addValuesWithDelegateCall()", function () {
    it("should successfully add values with delegate call", async () => {
      const { owner, machine, calculator } = await loadFixture(
        deployMachineFixture2
      );
      const result = await machine.addValuesWithDelegateCall(
        calculator.address,
        1,
        2
      );
      await expect(result)
        .to.emit(machine, "AddedValuesByDelegateCall")
        .withArgs(1, 2, true);
      expect(result.from).to.equal(owner.address);
      expect(result.to).to.equal(machine.address);
      expect(await calculator.calculateResult()).to.equal(0);
      expect(await machine.calculateResult()).to.equal(3);
      expect(await machine.user()).to.equal(owner.address);
      expect(await calculator.user()).be.equal(ZERO_ADDRESS);
    });
  });
});
