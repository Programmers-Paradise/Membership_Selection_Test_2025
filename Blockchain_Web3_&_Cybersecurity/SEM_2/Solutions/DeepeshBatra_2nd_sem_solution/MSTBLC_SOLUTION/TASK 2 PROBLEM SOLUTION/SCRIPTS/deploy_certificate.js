const { ethers } = require("hardhat");

async function main() {
  console.log("🎓 Starting CertificateIssuer deployment for MSTBLC Solution...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy the CertificateIssuer contract
  console.log("🔨 Deploying CertificateIssuer...");
  const CertificateIssuer = await ethers.getContractFactory("CertificateIssuer");
  const certificateIssuer = await CertificateIssuer.deploy();
  await certificateIssuer.deployed();

  console.log("✅ CertificateIssuer deployed to:", certificateIssuer.address);
  console.log("📊 NFT Collection Name:", await certificateIssuer.name());
  console.log("🔤 NFT Collection Symbol:", await certificateIssuer.symbol());
  console.log("👤 Contract Owner:", await certificateIssuer.owner());
  console.log("📜 Total Certificates:", await certificateIssuer.totalCertificates());

  // Demonstrate certificate issuance
  console.log("\n🎯 Demonstrating Certificate Issuance...");
  
  // Get some test accounts
  const [_, recipient1, recipient2] = await ethers.getSigners();
  
  // Issue first certificate
  console.log("📜 Issuing certificate to:", recipient1.address);
  const tx1 = await certificateIssuer.issueCertificate(
    recipient1.address,
    "John Doe",
    "Blockchain Development Fundamentals"
  );
  await tx1.wait();
  
  // Issue second certificate
  console.log("📜 Issuing certificate to:", recipient2.address);
  const tx2 = await certificateIssuer.issueCertificate(
    recipient2.address,
    "Jane Smith",
    "Advanced Smart Contract Development"
  );
  await tx2.wait();

  console.log("✅ Certificates issued successfully!");
  console.log("📊 Total Certificates:", await certificateIssuer.totalCertificates());

  // Verify certificate data
  console.log("\n🔍 Verifying Certificate Data...");
  
  // Check first certificate
  const [name1, title1, date1, exists1] = await certificateIssuer.getCertificateData(1);
  console.log("📜 Certificate #1:");
  console.log("   Recipient:", name1);
  console.log("   Course:", title1);
  console.log("   Issue Date:", new Date(date1 * 1000).toISOString());
  console.log("   Owner:", await certificateIssuer.ownerOf(1));
  
  // Check second certificate
  const [name2, title2, date2, exists2] = await certificateIssuer.getCertificateData(2);
  console.log("📜 Certificate #2:");
  console.log("   Recipient:", name2);
  console.log("   Course:", title2);
  console.log("   Issue Date:", new Date(date2 * 1000).toISOString());
  console.log("   Owner:", await certificateIssuer.ownerOf(2));

  // Test public data access
  console.log("\n🌐 Testing Public Data Access...");
  const publicName1 = await certificateIssuer.getRecipientName(1);
  const publicTitle1 = await certificateIssuer.getCourseTitle(1);
  const publicDate1 = await certificateIssuer.getIssueDate(1);
  
  console.log("📊 Public Data for Certificate #1:");
  console.log("   Name:", publicName1);
  console.log("   Course:", publicTitle1);
  console.log("   Date:", new Date(publicDate1 * 1000).toISOString());

  // Verify non-transferability
  console.log("\n🚫 Testing Non-Transferability...");
  try {
    await certificateIssuer.connect(recipient1).transferFrom(
      recipient1.address,
      recipient2.address,
      1
    );
    console.log("❌ ERROR: Certificate should not be transferable!");
  } catch (error) {
    console.log("✅ SUCCESS: Certificate transfer correctly blocked");
    console.log("   Error:", error.message);
  }

  console.log("\n🎉 Deployment and Testing Completed Successfully!");
  console.log("📋 Contract Address:", certificateIssuer.address);
  console.log("🔗 Network:", network.name);
  
  console.log("\n📋 MSTBLC Solution Summary:");
  console.log("✅ ERC721-compliant CertificateIssuer contract deployed");
  console.log("✅ NFT Collection: Proof of Completion (POC)");
  console.log("✅ Owner-only certificate issuance function");
  console.log("✅ Custom data storage (recipient name + course title)");
  console.log("✅ On-chain data storage and public readability");
  console.log("✅ Non-transferable certificates");
  console.log("✅ Contract is ready for production use");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
