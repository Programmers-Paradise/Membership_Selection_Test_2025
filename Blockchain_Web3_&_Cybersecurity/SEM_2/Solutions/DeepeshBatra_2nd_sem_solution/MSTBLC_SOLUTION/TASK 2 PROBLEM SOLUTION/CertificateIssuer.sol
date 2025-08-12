// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CertificateIssuer
 * @dev ERC721-compliant smart contract for issuing unique "Proof of Completion" certificates
 * @author Deepesh Batra
 * @notice This contract creates non-fungible certificates with custom data storage
 */
contract CertificateIssuer is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    // Counter for generating unique token IDs
    Counters.Counter private _tokenIds;
    
    // Structure to store certificate data
    struct CertificateData {
        string recipientName;
        string courseTitle;
        uint256 issueDate;
        bool exists;
    }
    
    // Mapping from token ID to certificate data
    mapping(uint256 => CertificateData) private _certificateData;
    
    // Events
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string recipientName,
        string courseTitle,
        uint256 issueDate
    );
    
    /**
     * @dev Constructor sets the NFT collection name and symbol
     */
    constructor() ERC721("Proof of Completion", "POC") Ownable(msg.sender) {}
    
    /**
     * @dev Mints a new certificate NFT and assigns it to a specified recipient
     * @param recipient The address to receive the certificate
     * @param recipientName The name of the certificate recipient
     * @param courseTitle The title of the completed course
     * @return tokenId The ID of the newly minted certificate
     * @notice Only the contract owner can call this function
     */
    function issueCertificate(
        address recipient,
        string memory recipientName,
        string memory courseTitle
    ) public onlyOwner returns (uint256) {
        require(recipient != address(0), "CertificateIssuer: recipient cannot be zero address");
        require(bytes(recipientName).length > 0, "CertificateIssuer: recipient name cannot be empty");
        require(bytes(courseTitle).length > 0, "CertificateIssuer: course title cannot be empty");
        
        // Increment token ID counter
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint the NFT to the recipient
        _safeMint(recipient, newTokenId);
        
        // Store the certificate data
        _certificateData[newTokenId] = CertificateData({
            recipientName: recipientName,
            courseTitle: courseTitle,
            issueDate: block.timestamp,
            exists: true
        });
        
        // Emit event
        emit CertificateIssued(
            newTokenId,
            recipient,
            recipientName,
            courseTitle,
            block.timestamp
        );
        
        return newTokenId;
    }
    
    /**
     * @dev Returns the certificate data for a given token ID
     * @param tokenId The ID of the certificate
     * @return recipientName The name of the certificate recipient
     * @return courseTitle The title of the completed course
     * @return issueDate The timestamp when the certificate was issued
     * @return exists Whether the certificate exists
     */
    function getCertificateData(uint256 tokenId) 
        public 
        view 
        returns (
            string memory recipientName,
            string memory courseTitle,
            uint256 issueDate,
            bool exists
        ) 
    {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        
        CertificateData memory data = _certificateData[tokenId];
        return (
            data.recipientName,
            data.courseTitle,
            data.issueDate,
            data.exists
        );
    }
    
    /**
     * @dev Returns the recipient name for a given token ID
     * @param tokenId The ID of the certificate
     * @return The name of the certificate recipient
     */
    function getRecipientName(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        return _certificateData[tokenId].recipientName;
    }
    
    /**
     * @dev Returns the course title for a given token ID
     * @param tokenId The ID of the certificate
     * @return The title of the completed course
     */
    function getCourseTitle(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        return _certificateData[tokenId].courseTitle;
    }
    
    /**
     * @dev Returns the issue date for a given token ID
     * @param tokenId The ID of the certificate
     * @return The timestamp when the certificate was issued
     */
    function getIssueDate(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        return _certificateData[tokenId].issueDate;
    }
    
    /**
     * @dev Returns the total number of certificates issued
     * @return The total count of certificates
     */
    function totalCertificates() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Returns the next token ID that will be assigned
     * @return The next token ID
     */
    function nextTokenId() public view returns (uint256) {
        return _tokenIds.current() + 1;
    }
    
    /**
     * @dev Checks if a certificate exists for a given token ID
     * @param tokenId The ID of the certificate
     * @return True if the certificate exists, false otherwise
     */
    function certificateExists(uint256 tokenId) public view returns (bool) {
        return _certificateData[tokenId].exists;
    }
    
    /**
     * @dev Returns the owner of a certificate
     * @param tokenId The ID of the certificate
     * @return The address of the certificate owner
     */
    function getCertificateOwner(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        return ownerOf(tokenId);
    }
    
    /**
     * @dev Override the _baseURI function to return a custom base URI
     * @return The base URI for token metadata
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://certificates.example.com/metadata/";
    }
    
    /**
     * @dev Override the tokenURI function to return the metadata URI
     * @param tokenId The ID of the certificate
     * @return The URI for the token metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "CertificateIssuer: certificate does not exist");
        
        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
    }
    
    /**
     * @dev Converts a uint256 to a string
     * @param value The uint256 value to convert
     * @return The string representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    /**
     * @dev Prevents token transfers - certificates are non-transferable
     * @notice This function is overridden to make certificates non-transferable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0) || to == address(0), "CertificateIssuer: certificates are non-transferable");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
    
    /**
     * @dev Prevents approval of certificates for transfer
     * @notice This function is overridden to make certificates non-transferable
     */
    function approve(address to, uint256 tokenId) public virtual override {
        revert("CertificateIssuer: certificates cannot be approved for transfer");
    }
    
    /**
     * @dev Prevents setting approval for all certificates
     * @notice This function is overridden to make certificates non-transferable
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("CertificateIssuer: certificates cannot be approved for transfer");
    }
    
    /**
     * @dev Prevents transferring certificates from one address to another
     * @notice This function is overridden to make certificates non-transferable
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("CertificateIssuer: certificates cannot be transferred");
    }
    
    /**
     * @dev Prevents safe transferring of certificates
     * @notice This function is overridden to make certificates non-transferable
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("CertificateIssuer: certificates cannot be transferred");
    }
    
    /**
     * @dev Prevents safe transferring of certificates with data
     * @notice This function is overridden to make certificates non-transferable
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("CertificateIssuer: certificates cannot be transferred");
    }
}
