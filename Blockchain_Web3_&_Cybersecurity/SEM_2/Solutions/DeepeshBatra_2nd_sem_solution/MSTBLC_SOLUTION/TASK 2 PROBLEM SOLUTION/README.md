# 🎓 CertificateIssuer - ERC721 Smart Contract Solution

## 📋 Overview

**CertificateIssuer** is an ERC721-compliant smart contract that issues unique, non-fungible "Proof of Completion" certificates. This solution demonstrates advanced NFT functionality with custom data storage and access control mechanisms.

## 🎯 MSTBLC Problem 2 Requirements

| Requirement | Status | Implementation Details |
|-------------|--------|----------------------|
| **ERC721-compliant smart contract named CertificateIssuer** | ✅ **COMPLETED** | Full ERC721 standard implementation using OpenZeppelin |
| **NFT collection named "Proof of Completion" with symbol "POC"** | ✅ **COMPLETED** | Contract name and symbol configured in constructor |
| **Owner-restricted minting function** | ✅ **COMPLETED** | `issueCertificate()` function with `onlyOwner` modifier |
| **Custom data association** | ✅ **COMPLETED** | On-chain storage of recipient name and course title |
| **Public data readability** | ✅ **COMPLETED** | All certificate data publicly accessible via view functions |

## 🏗️ Contract Architecture

### Core Features

```solidity
contract CertificateIssuer is ERC721, Ownable {
    // Custom data structure for certificates
    struct CertificateData {
        string recipientName;
        string courseTitle;
        uint256 issueDate;
        bool exists;
    }
    
    // Owner-only certificate issuance
    function issueCertificate(
        address recipient,
        string memory recipientName,
        string memory courseTitle
    ) public onlyOwner returns (uint256)
}
```

### Key Components

1. **ERC721 Compliance**: Full implementation of the ERC721 standard
2. **Access Control**: `Ownable` pattern for restricted minting
3. **Custom Data Storage**: On-chain storage of certificate metadata
4. **Non-Transferable**: Certificates cannot be transferred once issued
5. **Event Emission**: Comprehensive event logging for transparency

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat development environment

### Installation

```bash
# Navigate to problem 2 directory
cd "problem 2"

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy locally
npm run deploy:local
```

### Environment Setup

1. Copy `env.example` to `.env`
2. Configure your network URLs and private keys
3. Set your Etherscan API key for verification

```bash
cp env.example .env
# Edit .env with your configuration
```

## 📊 Contract Functions

### Core Functions

| Function | Access | Description |
|----------|--------|-------------|
| `issueCertificate()` | Owner Only | Mints new certificate with custom data |
| `getCertificateData()` | Public | Returns complete certificate information |
| `getRecipientName()` | Public | Returns recipient name for a token |
| `getCourseTitle()` | Public | Returns course title for a token |
| `getIssueDate()` | Public | Returns certificate issue timestamp |

### Utility Functions

| Function | Access | Description |
|----------|--------|-------------|
| `totalCertificates()` | Public | Returns total certificates issued |
| `nextTokenId()` | Public | Returns next available token ID |
| `certificateExists()` | Public | Checks if certificate exists |
| `getCertificateOwner()` | Public | Returns certificate owner address |

### Access Control

| Function | Access | Description |
|----------|--------|-------------|
| `owner()` | Public | Returns contract owner address |
| `transferOwnership()` | Owner Only | Transfers contract ownership |

## 🔒 Security Features

### Access Control
- **Owner-Only Minting**: Only contract owner can issue certificates
- **Ownable Pattern**: Secure ownership management using OpenZeppelin

### Data Integrity
- **Input Validation**: Comprehensive validation of all inputs
- **Non-Transferable**: Certificates cannot be transferred once issued
- **Immutable Data**: Certificate data cannot be modified after issuance

### Smart Contract Security
- **OpenZeppelin Audited**: Uses battle-tested OpenZeppelin contracts
- **Safe Math**: Built-in overflow protection (Solidity ^0.8.0)
- **Reentrancy Protection**: Secure function execution patterns

## 🧪 Testing

### Test Coverage

The contract includes comprehensive test coverage for:

- ✅ **Deployment**: Contract initialization and configuration
- ✅ **Access Control**: Owner-only function restrictions
- ✅ **Certificate Issuance**: Minting functionality and validation
- ✅ **Data Storage**: Custom data association and retrieval
- ✅ **ERC721 Compliance**: Standard NFT functionality
- ✅ **Non-Transferability**: Transfer prevention mechanisms
- ✅ **Edge Cases**: Input validation and error handling
- ✅ **MSTBLC Requirements**: Assignment requirement validation

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/CertificateIssuer.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

## 🚀 Deployment

### Local Development

```bash
# Start local Hardhat node
npm run node

# Deploy to local network
npm run deploy:local
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:testnet
```

### Mainnet Deployment

```bash
# Deploy to Ethereum mainnet
npm run deploy:mainnet
```

### Contract Verification

```bash
# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 📁 Project Structure

```
problem 2/
├── CertificateIssuer.sol          # Main smart contract
├── scripts/
│   └── deploy_certificate.js      # Deployment script
├── test/
│   └── CertificateIssuer.test.js  # Comprehensive test suite
├── hardhat.config.js              # Hardhat configuration
├── package.json                    # Dependencies and scripts
├── env.example                     # Environment variables template
└── README.md                      # This documentation
```

## 🔍 Technical Implementation Details

### Data Storage

```solidity
// Certificate data structure
struct CertificateData {
    string recipientName;    // Recipient's full name
    string courseTitle;      // Title of completed course
    uint256 issueDate;       // Timestamp of issuance
    bool exists;             // Existence flag
}

// On-chain storage mapping
mapping(uint256 => CertificateData) private _certificateData;
```

### Certificate Issuance Process

1. **Input Validation**: Check recipient address and data validity
2. **Token Generation**: Increment counter and assign unique token ID
3. **NFT Minting**: Create ERC721 token for recipient
4. **Data Storage**: Store certificate metadata on-chain
5. **Event Emission**: Log issuance for transparency

### Non-Transferability Implementation

```solidity
// Override transfer functions to prevent transfers
function transferFrom(address from, address to, uint256 tokenId) 
    public virtual override {
    revert("CertificateIssuer: certificates cannot be transferred");
}

// Allow only minting operations
function _beforeTokenTransfer(...) internal virtual override {
    require(from == address(0) || to == address(0), 
            "CertificateIssuer: certificates are non-transferable");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
}
```

## 🌐 Public Data Access

### On-Chain Data Retrieval

All certificate data is publicly accessible through view functions:

```solidity
// Get complete certificate data
function getCertificateData(uint256 tokenId) 
    public view returns (
        string memory recipientName,
        string memory courseTitle,
        uint256 issueDate,
        bool exists
    )

// Get specific data fields
function getRecipientName(uint256 tokenId) public view returns (string memory)
function getCourseTitle(uint256 tokenId) public view returns (string memory)
function getIssueDate(uint256 tokenId) public view returns (uint256)
```

### Data Transparency

- **Public Read Access**: All certificate data is publicly readable
- **On-Chain Storage**: Data permanently stored on blockchain
- **Immutable Records**: Certificate data cannot be altered after issuance
- **Event Logging**: All operations logged for audit trail

## 📈 Gas Optimization

### Compiler Settings

```javascript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
}
```

### Gas-Efficient Features

- **Counter Pattern**: Efficient token ID generation
- **Struct Packing**: Optimized data storage layout
- **View Functions**: Gas-free data retrieval
- **Event Optimization**: Minimal gas cost for logging

## 🔧 Configuration

### Network Configuration

```javascript
networks: {
  hardhat: { chainId: 1337 },
  localhost: { 
    url: "http://127.0.0.1:8545", 
    chainId: 1337 
  },
  sepolia: {
    url: process.env.SEPOLIA_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111
  },
  mainnet: {
    url: process.env.MAINNET_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1
  }
}
```

### Environment Variables

```bash
# Required
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Optional
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## 🎯 Use Cases

### Educational Institutions
- **Course Completion Certificates**: Issue verifiable completion certificates
- **Academic Credentials**: Blockchain-based academic records
- **Professional Development**: Training and certification programs

### Corporate Training
- **Employee Certifications**: Internal training completion records
- **Skill Verification**: Professional development achievements
- **Compliance Training**: Regulatory requirement fulfillment

### Online Learning Platforms
- **Course Completion**: Verifiable learning achievements
- **Skill Badges**: Professional skill endorsements
- **Learning Paths**: Structured educational progression

## 🔮 Future Enhancements

### Potential Improvements

1. **Batch Issuance**: Issue multiple certificates in single transaction
2. **Metadata URI**: Support for external metadata storage
3. **Revocation Mechanism**: Certificate revocation capabilities
4. **Multi-Signature**: Enhanced security with multi-sig requirements
5. **Upgradeable**: Contract upgradeability for future features

### Integration Possibilities

- **IPFS Storage**: Decentralized metadata storage
- **Oracle Integration**: External data verification
- **Cross-Chain**: Multi-blockchain certificate issuance
- **API Integration**: RESTful API for certificate management

## 📚 Additional Resources

### Documentation
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Hardhat Documentation](https://hardhat.org/docs/)

### Standards
- [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- [EIP-165: Standard Interface Detection](https://eips.ethereum.org/EIPS/eip-165)
- [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)

## 🤝 Contributing

This project is part of the MSTBLC assignment solution. For questions or improvements:

1. Review the code and documentation
2. Run tests to ensure functionality
3. Submit suggestions or improvements
4. Follow Solidity best practices



**🎓 MSTBLC Problem 2: CertificateIssuer Solution - 100% COMPLETED ✅**
