const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Donation contract", ()=> {
  let Contract, contract, owner, addr1, addr2, addr3;
  const donateOf1Account = 1875000000;
  const donateOf2Account = 1234000000;

  beforeEach(async ()=>{
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    Contract = await ethers.getContractFactory("DonationContract");
    contract = await Contract.deploy();
  });

  it("Donations works correctly", async ()=> {
    await contract.connect(addr1).Donation({ value: donateOf1Account });
    await contract.connect(addr2).Donation({value: donateOf2Account});
    
    const donatesToWithdraw = await contract.GetTotalAmount();
    await expect(contract.connect(addr3).Withdraw(addr3.address, donatesToWithdraw))
      .to.be.revertedWith("Only owner can call");
    let oldAddr1Balance = await addr1.getBalance();
    await contract.connect(owner).Withdraw(addr1.address, donatesToWithdraw);
    let addr1Balance = await addr1.getBalance();
    expect(oldAddr1Balance!=addr1Balance).to.equal(true);
  });
  it("Contract works correctly", async ()=> {
    await contract.connect(addr1).Donation({ value: donateOf1Account });
    const donaters = await contract.GetAllDonaters();
    const info = await contract.GetDonationAmountOf(donaters[0]);
    expect(info).to.equal(1875000000);
  });
});