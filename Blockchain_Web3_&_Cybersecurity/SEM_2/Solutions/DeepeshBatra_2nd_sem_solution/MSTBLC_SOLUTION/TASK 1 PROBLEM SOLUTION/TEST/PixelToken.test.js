const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PixelToken - MSTBLC Solution", function () {
  let PixelToken, pixelToken, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    PixelToken = await ethers.getContractFactory("PixelToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new PixelToken contract before each test
    pixelToken = await PixelToken.deploy();
    await pixelToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pixelToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await pixelToken.balanceOf(owner.address);
      const totalSupply = await pixelToken.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("Should have correct token name and symbol", async function () {
      expect(await pixelToken.name()).to.equal("Pixel Token");
      expect(await pixelToken.symbol()).to.equal("PXL");
    });

    it("Should have 18 decimals", async function () {
      expect(await pixelToken.decimals()).to.equal(18);
    });

    it("Should have total supply of 1,000,000 tokens", async function () {
      const totalSupply = await pixelToken.totalSupply();
      const expectedSupply = ethers.utils.parseEther("1000000");
      expect(totalSupply).to.equal(expectedSupply);
    });

    it("Should allocate all tokens to deployer", async function () {
      const deployerBalance = await pixelToken.balanceOf(owner.address);
      const totalSupply = await pixelToken.totalSupply();
      expect(deployerBalance).to.equal(totalSupply);
      expect(ethers.utils.formatEther(deployerBalance)).to.equal("1000000.0");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await pixelToken.transfer(addr1.address, 50);
      const addr1Balance = await pixelToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await pixelToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await pixelToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await pixelToken.balanceOf(owner.address);
      
      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        pixelToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await pixelToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pixelToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await pixelToken.transfer(addr1.address, 100);
      
      // Transfer another 50 tokens from owner to addr2
      await pixelToken.transfer(addr2.address, 50);

      // Check balances
      const finalOwnerBalance = await pixelToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await pixelToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await pixelToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Allowances", function () {
    it("Should approve and transferFrom correctly", async function () {
      // Owner approves addr1 to spend 100 tokens
      await pixelToken.approve(addr1.address, 100);
      expect(await pixelToken.allowance(owner.address, addr1.address)).to.equal(100);

      // addr1 transfers 50 tokens from owner to addr2
      await pixelToken.connect(addr1).transferFrom(owner.address, addr2.address, 50);
      
      // Check balances
      expect(await pixelToken.balanceOf(addr2.address)).to.equal(50);
      expect(await pixelToken.allowance(owner.address, addr1.address)).to.equal(50);
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      // Owner approves addr1 to spend 100 tokens
      await pixelToken.approve(addr1.address, 100);
      
      // Try to transfer 150 tokens (more than allowance)
      await expect(
        pixelToken.connect(addr1).transferFrom(owner.address, addr2.address, 150)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Should increase and decrease allowance correctly", async function () {
      // Initial approval of 100 tokens
      await pixelToken.approve(addr1.address, 100);
      expect(await pixelToken.allowance(owner.address, addr1.address)).to.equal(100);

      // Increase allowance by 50
      await pixelToken.increaseAllowance(addr1.address, 50);
      expect(await pixelToken.allowance(owner.address, addr1.address)).to.equal(150);

      // Decrease allowance by 30
      await pixelToken.decreaseAllowance(addr1.address, 30);
      expect(await pixelToken.allowance(owner.address, addr1.address)).to.equal(120);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      const initialBalance = await pixelToken.balanceOf(owner.address);
      
      // Transfer 0 tokens
      await pixelToken.transfer(addr1.address, 0);
      
      // Balances should remain the same
      expect(await pixelToken.balanceOf(owner.address)).to.equal(initialBalance);
      expect(await pixelToken.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should handle transfer to zero address", async function () {
      // This should fail as per ERC20 standard
      await expect(
        pixelToken.transfer(ethers.constants.AddressZero, 100)
      ).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    it("Should handle transfer from zero address", async function () {
      // This should fail as per ERC20 standard
      await expect(
        pixelToken.transferFrom(ethers.constants.AddressZero, addr1.address, 100)
      ).to.be.revertedWith("ERC20: transfer from the zero address");
    });
  });

  describe("Events", function () {
    it("Should emit Transfer events", async function () {
      await expect(pixelToken.transfer(addr1.address, 100))
        .to.emit(pixelToken, "Transfer")
        .withArgs(owner.address, addr1.address, 100);
    });

    it("Should emit Approval events", async function () {
      await expect(pixelToken.approve(addr1.address, 100))
        .to.emit(pixelToken, "Approval")
        .withArgs(owner.address, addr1.address, 100);
    });
  });

  describe("MSTBLC Requirements", function () {
    it("Should meet all MSTBLC assignment requirements", async function () {
      // Requirement 1: Token collection named "Pixel Token"
      expect(await pixelToken.name()).to.equal("Pixel Token");
      
      // Requirement 2: Token symbol "PXL"
      expect(await pixelToken.symbol()).to.equal("PXL");
      
      // Requirement 3: Initial total supply of 1,000,000 tokens
      const totalSupply = await pixelToken.totalSupply();
      expect(ethers.utils.formatEther(totalSupply)).to.equal("1000000.0");
      
      // Requirement 4: All tokens allocated to deployer
      const deployerBalance = await pixelToken.balanceOf(owner.address);
      expect(deployerBalance).to.equal(totalSupply);
      
      // Requirement 5: ERC20 compliant
      expect(await pixelToken.decimals()).to.equal(18);
      expect(await pixelToken.totalSupply()).to.be.gt(0);
    });
  });
});
