const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [owner, acc1, acc2] = await ethers.getSigners();
  const Contract = await hre.ethers.getContractFactory("DonationContract", owner);
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`Address: ${contract.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
