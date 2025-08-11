const { run } = require("hardhat");

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
  
  console.log("🔍 Verifying contract on Etherscan...");
  console.log("📋 Contract Address:", contractAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    
    console.log("✅ Contract verified successfully on Etherscan!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️ Contract is already verified on Etherscan");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
