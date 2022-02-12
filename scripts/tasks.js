const hre = require("hardhat");
const ethers = hre.ethers;
const DonationArtifacts = require("../artifacts/contracts/DonationContract.sol/DonationContract.json");

async function main() {
  const [owner, acc1, acc2] = await ethers.getSigners();
  const contractAddress = "0x523a5D5F80a48360D6D707F0F99670E585D7e920";
  const tx = {
      to: contractAddress.address,
      value: ethers.utils.parseEther(".05")
  }
  const donationContractForAcc1 = new ethers.Contract(
      contractAddress,
      DonationArtifacts.abi,
      acc1
  );
  const donationContractForOwner = new ethers.Contract(
      contractAddress,
      DonationArtifacts.abi,
      owner
  );

  await showBalance("1 account: ", acc1.address);
  await showBalance("contract: ", contractAddress);
  let txSend = await donationContractForAcc1.Donation(tx);
  await txSend.wait();
  await showBalance("1 account: ", acc1.address);
  await showBalance("contract: ", contractAddress);
  await showBalance("2 account: ", acc2.address);
  const amount = await donationContractForOwner.GetTotalAmount();
  txSend = await donationContractForOwner.Withdraw(acc2.address, amount);
  await txSend.wait();
  await showBalance("contract: ", contractAddress);
  await showBalance("2 account: ", acc2.address);
}
async function showBalance(msg, address) {
  const rawBalance = await ethers.provider.getBalance(address);
  console.log(msg + ethers.utils.formatEther(rawBalance));
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
