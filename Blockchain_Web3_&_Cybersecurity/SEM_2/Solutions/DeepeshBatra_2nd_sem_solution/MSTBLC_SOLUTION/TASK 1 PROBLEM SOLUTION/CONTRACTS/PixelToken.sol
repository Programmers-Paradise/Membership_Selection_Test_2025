// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PixelToken is ERC20 {
    
    constructor() ERC20("Pixel Token", "PXL") {
        // Create 1,000,000 tokens and give them to the person deploying the contract
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
