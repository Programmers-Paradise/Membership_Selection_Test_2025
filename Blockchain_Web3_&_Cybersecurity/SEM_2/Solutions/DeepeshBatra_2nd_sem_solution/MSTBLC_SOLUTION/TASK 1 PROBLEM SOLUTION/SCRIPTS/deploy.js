const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Pixel Token deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy the PixelToken contract
  console.log("🔨 Deploying PixelToken...");
  const PixelToken = await ethers.getContractFactory("PixelToken");
  const pixelToken = await PixelToken.deploy();
  await pixelToken.deployed();

  console.log("✅ PixelToken deployed to:", pixelToken.address);
  console.log("📊 Token Name:", await pixelToken.name());
  console.log("🔤 Token Symbol:", await pixelToken.symbol());
  console.log("🔢 Token Decimals:", await pixelToken.decimals());
  console.log("💎 Total Supply:", ethers.utils.formatEther(await pixelToken.totalSupply()), "PXL");
  console.log("👤 Deployer Balance:", ethers.utils.formatEther(await pixelToken.balanceOf(deployer.address)), "PXL");

  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  const deployerBalance = await pixelToken.balanceOf(deployer.address);
  const totalSupply = await pixelToken.totalSupply();
  
  if (deployerBalance.eq(totalSupply)) {
    console.log("✅ SUCCESS: All 1,000,000 PXL tokens allocated to deployer!");
  } else {
    console.log("❌ ERROR: Token allocation mismatch!");
    console.log("Expected:", ethers.utils.formatEther(totalSupply), "PXL");
    console.log("Actual:", ethers.utils.formatEther(deployerBalance), "PXL");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Address:", pixelToken.address);
  console.log("🔗 Network:", network.name);
  console.log("⛽ Gas Used:", (await pixelToken.deployTransaction.wait()).gasUsed.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
