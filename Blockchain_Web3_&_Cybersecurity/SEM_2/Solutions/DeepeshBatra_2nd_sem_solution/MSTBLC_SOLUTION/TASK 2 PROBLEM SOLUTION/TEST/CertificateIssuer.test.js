const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateIssuer - MSTBLC Solution", function () {
  let CertificateIssuer, certificateIssuer, owner, recipient1, recipient2, unauthorizedUser;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    CertificateIssuer = await ethers.getContractFactory("CertificateIssuer");
    [owner, recipient1, recipient2, unauthorizedUser] = await ethers.getSigners();

    // Deploy a new CertificateIssuer contract before each test
    certificateIssuer = await CertificateIssuer.deploy();
    await certificateIssuer.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificateIssuer.owner()).to.equal(owner.address);
    });

    it("Should have correct NFT collection name", async function () {
      expect(await certificateIssuer.name()).to.equal("Proof of Completion");
    });

    it("Should have correct NFT collection symbol", async function () {
      expect(await certificateIssuer.symbol()).to.equal("POC");
    });

    it("Should start with 0 total certificates", async function () {
      expect(await certificateIssuer.totalCertificates()).to.equal(0);
    });

    it("Should return correct next token ID", async function () {
      expect(await certificateIssuer.nextTokenId()).to.equal(1);
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow owner to issue a certificate", async function () {
      const recipientName = "John Doe";
      const courseTitle = "Blockchain Development Fundamentals";
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, recipientName, courseTitle)
      ).to.emit(certificateIssuer, "CertificateIssued")
        .withArgs(1, recipient1.address, recipientName, courseTitle, await time());

      expect(await certificateIssuer.totalCertificates()).to.equal(1);
      expect(await certificateIssuer.ownerOf(1)).to.equal(recipient1.address);
    });

    it("Should not allow non-owner to issue certificates", async function () {
      const recipientName = "Jane Smith";
      const courseTitle = "Advanced Solidity";
      
      await expect(
        certificateIssuer.connect(unauthorizedUser).issueCertificate(
          recipient1.address, 
          recipientName, 
          courseTitle
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should reject zero address recipient", async function () {
      const recipientName = "Invalid User";
      const courseTitle = "Test Course";
      
      await expect(
        certificateIssuer.issueCertificate(
          ethers.constants.AddressZero, 
          recipientName, 
          courseTitle
        )
      ).to.be.revertedWith("CertificateIssuer: recipient cannot be zero address");
    });

    it("Should reject empty recipient name", async function () {
      const recipientName = "";
      const courseTitle = "Test Course";
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, recipientName, courseTitle)
      ).to.be.revertedWith("CertificateIssuer: recipient name cannot be empty");
    });

    it("Should reject empty course title", async function () {
      const recipientName = "Test User";
      const courseTitle = "";
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, recipientName, courseTitle)
      ).to.be.revertedWith("CertificateIssuer: course title cannot be empty");
    });

    it("Should issue multiple certificates with correct token IDs", async function () {
      // Issue first certificate
      await certificateIssuer.issueCertificate(
        recipient1.address, 
        "Alice Johnson", 
        "Web3 Development"
      );
      
      // Issue second certificate
      await certificateIssuer.issueCertificate(
        recipient2.address, 
        "Bob Smith", 
        "Smart Contract Security"
      );

      expect(await certificateIssuer.totalCertificates()).to.equal(2);
      expect(await certificateIssuer.ownerOf(1)).to.equal(recipient1.address);
      expect(await certificateIssuer.ownerOf(2)).to.equal(recipient2.address);
    });
  });

  describe("Certificate Data Storage", function () {
    let tokenId;
    const recipientName = "Sarah Wilson";
    const courseTitle = "DeFi Protocol Development";

    beforeEach(async function () {
      // Issue a certificate for testing
      const tx = await certificateIssuer.issueCertificate(
        recipient1.address, 
        recipientName, 
        courseTitle
      );
      const receipt = await tx.wait();
      tokenId = 1; // First certificate
    });

    it("Should store and retrieve complete certificate data", async function () {
      const [storedName, storedTitle, issueDate, exists] = await certificateIssuer.getCertificateData(tokenId);
      
      expect(storedName).to.equal(recipientName);
      expect(storedTitle).to.equal(courseTitle);
      expect(exists).to.be.true;
      expect(issueDate).to.be.gt(0);
    });

    it("Should return correct recipient name", async function () {
      const name = await certificateIssuer.getRecipientName(tokenId);
      expect(name).to.equal(recipientName);
    });

    it("Should return correct course title", async function () {
      const title = await certificateIssuer.getCourseTitle(tokenId);
      expect(title).to.equal(courseTitle);
    });

    it("Should return correct issue date", async function () {
      const issueDate = await certificateIssuer.getIssueDate(tokenId);
      expect(issueDate).to.be.gt(0);
      expect(issueDate).to.be.closeTo(await time(), 5); // Within 5 seconds
    });

    it("Should confirm certificate exists", async function () {
      expect(await certificateIssuer.certificateExists(tokenId)).to.be.true;
    });

    it("Should return correct certificate owner", async function () {
      expect(await certificateIssuer.getCertificateOwner(tokenId)).to.equal(recipient1.address);
    });

    it("Should reject queries for non-existent certificates", async function () {
      const nonExistentTokenId = 999;
      
      await expect(
        certificateIssuer.getCertificateData(nonExistentTokenId)
      ).to.be.revertedWith("CertificateIssuer: certificate does not exist");
      
      await expect(
        certificateIssuer.getRecipientName(nonExistentTokenId)
      ).to.be.revertedWith("CertificateIssuer: certificate does not exist");
      
      await expect(
        certificateIssuer.getCourseTitle(nonExistentTokenId)
      ).to.be.revertedWith("CertificateIssuer: certificate does not exist");
    });
  });

  describe("ERC721 Compliance", function () {
    let tokenId;

    beforeEach(async function () {
      // Issue a certificate for testing
      await certificateIssuer.issueCertificate(
        recipient1.address, 
        "Test User", 
        "Test Course"
      );
      tokenId = 1;
    });

    it("Should implement balanceOf correctly", async function () {
      expect(await certificateIssuer.balanceOf(recipient1.address)).to.equal(1);
      expect(await certificateIssuer.balanceOf(recipient2.address)).to.equal(0);
    });

    it("Should implement ownerOf correctly", async function () {
      expect(await certificateIssuer.ownerOf(tokenId)).to.equal(recipient1.address);
    });

    it("Should implement tokenOfOwnerByIndex correctly", async function () {
      expect(await certificateIssuer.tokenOfOwnerByIndex(recipient1.address, 0)).to.equal(tokenId);
    });

    it("Should implement totalSupply correctly", async function () {
      expect(await certificateIssuer.totalSupply()).to.equal(1);
    });
  });

  describe("Non-Transferable Certificates", function () {
    let tokenId;

    beforeEach(async function () {
      // Issue a certificate for testing
      await certificateIssuer.issueCertificate(
        recipient1.address, 
        "Test User", 
        "Test Course"
      );
      tokenId = 1;
    });

    it("Should prevent certificate transfers", async function () {
      await expect(
        certificateIssuer.connect(recipient1).transferFrom(
          recipient1.address, 
          recipient2.address, 
          tokenId
        )
      ).to.be.revertedWith("CertificateIssuer: certificates cannot be transferred");
    });

    it("Should prevent safe transfers", async function () {
      await expect(
        certificateIssuer.connect(recipient1).safeTransferFrom(
          recipient1.address, 
          recipient2.address, 
          tokenId
        )
      ).to.be.revertedWith("CertificateIssuer: certificates cannot be transferred");
    });

    it("Should prevent approvals", async function () {
      await expect(
        certificateIssuer.connect(recipient1).approve(recipient2.address, tokenId)
      ).to.be.revertedWith("CertificateIssuer: certificates cannot be approved for transfer");
    });

    it("Should prevent setting approval for all", async function () {
      await expect(
        certificateIssuer.connect(recipient1).setApprovalForAll(recipient2.address, true)
      ).to.be.revertedWith("CertificateIssuer: certificates cannot be approved for transfer");
    });

    it("Should allow minting (from address(0))", async function () {
      // This should work as it's a mint operation
      await expect(
        certificateIssuer.issueCertificate(
          recipient2.address, 
          "Another User", 
          "Another Course"
        )
      ).to.not.be.reverted;
    });
  });

  describe("Events", function () {
    it("Should emit CertificateIssued event with correct parameters", async function () {
      const recipientName = "Event Test User";
      const courseTitle = "Event Test Course";
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, recipientName, courseTitle)
      ).to.emit(certificateIssuer, "CertificateIssued")
        .withArgs(1, recipient1.address, recipientName, courseTitle, await time());
    });
  });

  describe("MSTBLC Requirements", function () {
    it("Should meet all MSTBLC assignment requirements", async function () {
      // Requirement 1: ERC721-compliant smart contract named CertificateIssuer
      expect(await certificateIssuer.name()).to.equal("Proof of Completion");
      expect(await certificateIssuer.symbol()).to.equal("POC");
      
      // Requirement 2: Function restricted to contract owner to mint certificates
      const recipientName = "Requirement Test User";
      const courseTitle = "Requirement Test Course";
      
      // Owner can mint
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, recipientName, courseTitle)
      ).to.not.be.reverted;
      
      // Non-owner cannot mint
      await expect(
        certificateIssuer.connect(unauthorizedUser).issueCertificate(
          recipient2.address, 
          "Another User", 
          "Another Course"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
      // Requirement 3: Custom data storage with recipient name and course title
      const [storedName, storedTitle] = await certificateIssuer.getCertificateData(1);
      expect(storedName).to.equal(recipientName);
      expect(storedTitle).to.equal(courseTitle);
      
      // Requirement 4: Data stored on-chain and publicly readable
      const publicName = await certificateIssuer.getRecipientName(1);
      const publicTitle = await certificateIssuer.getCourseTitle(1);
      expect(publicName).to.equal(recipientName);
      expect(publicTitle).to.equal(courseTitle);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle long names and titles", async function () {
      const longName = "A".repeat(100); // 100 character name
      const longTitle = "B".repeat(200); // 200 character title
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, longName, longTitle)
      ).to.not.be.reverted;
      
      const [storedName, storedTitle] = await certificateIssuer.getCertificateData(1);
      expect(storedName).to.equal(longName);
      expect(storedTitle).to.equal(longTitle);
    });

    it("Should handle special characters in names and titles", async function () {
      const specialName = "José María O'Connor-Smith";
      const specialTitle = "Advanced Solidity & Web3 Development (2024)";
      
      await expect(
        certificateIssuer.issueCertificate(recipient1.address, specialName, specialTitle)
      ).to.not.be.reverted;
      
      const [storedName, storedTitle] = await certificateIssuer.getCertificateData(1);
      expect(storedName).to.equal(specialName);
      expect(storedTitle).to.equal(specialTitle);
    });
  });
});

// Helper function to get current timestamp
async function time() {
  return (await ethers.provider.getBlock("latest")).timestamp;
}
