# Smart Contract - Pixel Token

## What This Contract Does

The `PixelToken.sol` file creates a new cryptocurrency called "Pixel Token" with the symbol "PXL".

## How It Works

1. **When deployed**: Creates exactly 1,000,000 PXL tokens
2. **Who gets them**: The person who deploys the contract gets all tokens
3. **What it can do**: Everything a normal cryptocurrency can do:
   - Send tokens to other people
   - Check how many tokens someone has
   - Approve others to spend your tokens

## The Code (Only 20 lines!)

```solidity
contract PixelToken is ERC20 {
    
    constructor() ERC20("Pixel Token", "PXL") {
        // Create 1,000,000 tokens and give them to the deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
```

## What This Means

- **`ERC20`**: This makes it a standard cryptocurrency (works with all wallets)
- **`"Pixel Token"`**: The name of your cryptocurrency
- **`"PXL"`**: The short symbol for your token
- **`1000000`**: Creates exactly 1 million tokens
- **`msg.sender`**: The person deploying the contract
- **`10**decimals()`**: Makes it work with 18 decimal places (standard)

## Why It's Safe

- Uses OpenZeppelin (tested by thousands of people)
- Follows all the rules for cryptocurrencies
- Very simple - less chance for mistakes

## Ready to Deploy

This contract is ready to use immediately. No changes needed!
