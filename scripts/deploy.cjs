const hre = require("hardhat");


async function main() {
const TestUSDC = await hre.ethers.getContractFactory("TestUSDC");
const usdc = await TestUSDC.deploy();
await usdc.waitForDeployment();


console.log("TestUSDC deployed to:", await usdc.getAddress());


const Faucet = await hre.ethers.getContractFactory("Faucet");
const faucet = await Faucet.deploy(await usdc.getAddress());
await faucet.waitForDeployment();


console.log("Faucet deployed to:", await faucet.getAddress());


// make faucet the owner (so it can mint)
const tx = await usdc.transferOwnership(await faucet.getAddress());
await tx.wait();
console.log("Transferred TestUSDC ownership to Faucet");
}


main().catch((error) => {
console.error(error);
process.exitCode = 1;
});