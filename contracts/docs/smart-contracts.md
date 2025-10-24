# Sideway Smart Contracts

This repository contains the smart contracts for the Sideway collaborative content-idea marketplace, implementing a clone factory pattern for efficient payout contract deployment.

## Overview

The Sideway platform enables creators to post content ideas, invite collaborators dynamically, and automatically split revenue through on-chain attribution and ZORA token distribution. The smart contract architecture uses a clone factory pattern to minimize gas costs while maintaining upgradeability.

## Architecture

### Core Contracts

1. **CollaborativePayoutImplementation**: The main logic contract containing all payout and share management functionality
2. **CollaborativePayoutFactory**: Factory contract for deploying clone instances using OpenZeppelin's Clones library
3. **ICollaborativePayout**: Interface defining contract interactions

### Clone Pattern Benefits

- **Gas Efficiency**: ~95% gas savings compared to full contract deployment
- **Maintainability**: Single source of truth for logic updates
- **Scalability**: Unlimited clone instances from one implementation
- **Isolation**: Each clone has independent state

## Key Features

### Revenue Sharing
- Creator starts with 100% stake (10,000 basis points)
- Collaborators can be added dynamically with assigned shares
- Shares are measured in basis points (1% = 100 basis points)
- Revenue is distributed proportionally based on shares

### Fund Management
- Automatic receipt of ZORA tokens via `onPayout()` hook from Zora protocol
- Automatic distribution to stakeholders based on shares
- Pull-based withdrawal system via `withdraw()`
- Pending balance tracking for each stakeholder

### Access Control
- Only creator can add/remove collaborators
- Only creator can update share distributions
- Initialization required before any operations

## Contract Functions

### CollaborativePayoutImplementation

#### Core Functions
- `initialize(address creator, address contentCoin)`: Initialize clone with creator and content coin addresses
- `addCollaborator(address collaborator, uint256 share)`: Add collaborator with specified share
- `onPayout(IERC20 token, uint256 amount)`: Receive ZORA tokens from Zora protocol hook
- `withdraw(IERC20 token)`: Withdraw pending balance

#### View Functions
- `getRecipients()`: Get all recipient addresses
- `getShares(address recipient)`: Get share amount for recipient
- `getTotalReceived()`: Get total amount received
- `getPendingBalance(address recipient)`: Get pending balance for recipient
- `getTotalDistributed()`: Get total amount distributed

### CollaborativePayoutFactory

#### Core Functions
- `createPayout(address creator, address contentCoin)`: Create new clone instance
- `getCloneByCreator(address creator)`: Get clone address for creator
- `getCloneByContentCoin(address contentCoin)`: Get clone address for content coin
- `isValidClone(address clone)`: Check if address is valid clone

#### View Functions
- `allClonesCount()`: Get total number of clones
- `getAllClones()`: Get all clone addresses

## Events

- `FundsReceived(address indexed from, uint256 amount)`: Emitted when funds are deposited
- `Payout(address indexed recipient, uint256 amount)`: Emitted when funds are withdrawn
- `SharesUpdated(address[] recipients, uint256[] shares)`: Emitted when shares are updated
- `CloneCreated(address indexed cloneAddress, address indexed creator, address indexed contentCoin)`: Emitted when clone is created

## Usage Flow

### 1. Deployment
```bash
# Deploy implementation contract
forge create src/CollaborativePayoutImplementation.sol:CollaborativePayoutImplementation --rpc-url base_testnet --private-key $PRIVATE_KEY

# Deploy factory contract
forge create src/CollaborativePayoutFactory.sol:CollaborativePayoutFactory --constructor-args $IMPLEMENTATION_ADDRESS --rpc-url base_testnet --private-key $PRIVATE_KEY
```

### 2. Create Payout Contract
```solidity
// Call factory to create clone
address clone = factory.createPayout(creator, contentCoin);

// Use clone address as payoutRecipient in Zora coin creation
```

### 3. Manage Collaborators
```solidity
// Add collaborator with 25% share
collaborativePayout.addCollaborator(collaborator, 2500);

// Update share to 30%
collaborativePayout.updateShare(collaborator, 3000);

// Remove collaborator
collaborativePayout.removeCollaborator(collaborator);
```

### 4. Handle Revenue
```solidity
// Zora protocol automatically calls onPayout when rewards are distributed
// No manual deposit needed - funds come directly from Zora hook

// Withdraw funds
collaborativePayout.withdraw(zoraToken);
```

## Testing

The contracts include comprehensive tests covering:

- Factory deployment and clone creation
- Collaborator management (add only - update/remove commented out)
- Fund receipt via Zora hook and withdrawal
- Access control and security
- Edge cases and error conditions
- Multiple collaborator scenarios

Run tests with:
```bash
forge test
```

## Security Considerations

### Access Control
- Only creator can modify collaborator shares
- Initialization required before operations
- Input validation for all parameters

### Token Safety
- SafeERC20 library for safe token transfers
- Reentrancy protection via external calls after state updates
- Zero address and zero amount checks

### Edge Cases
- Share validation (sum must equal 10,000 basis points)
- Collaborator existence checks
- Sufficient creator share validation

## Deployment

### Prerequisites
- Foundry installed
- Private key with ETH for gas
- Etherscan API key for verification

### Environment Setup
```bash
# Copy environment template
cp env.example .env

# Fill in your values
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### Deploy Scripts
```bash
# Deploy to Base testnet
forge script script/Deploy.s.sol --rpc-url base_testnet --broadcast

# Deploy to Base mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast
```

### Verification
```bash
# Verify implementation
forge verify-contract $IMPLEMENTATION_ADDRESS src/CollaborativePayoutImplementation.sol:CollaborativePayoutImplementation --chain-id 8453 --etherscan-api-key $ETHERSCAN_API_KEY

# Verify factory
forge verify-contract $FACTORY_ADDRESS src/CollaborativePayoutFactory.sol:CollaborativePayoutFactory --chain-id 8453 --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args $(cast abi-encode "constructor(address)" $IMPLEMENTATION_ADDRESS)
```

## Gas Optimization

### Clone Pattern
- Minimal proxy pattern reduces deployment costs by ~95%
- Shared implementation reduces code duplication
- Independent storage per clone

### Function Optimization
- Efficient share calculation and distribution
- Batch operations where possible
- Minimal external calls

## Integration with Zora Protocol

The contracts are designed to integrate with Zora's Coins Protocol:

1. Deploy clone via factory before minting content coin
2. Use clone address as `payoutRecipient` in Zora coin creation
3. Set currency to ZORA token
4. Revenue from coin trading flows to clone contract
5. Clone distributes revenue according to shares

## Future Enhancements

- Multi-token support beyond ZORA
- Advanced governance mechanisms
- Automated revenue distribution triggers
- Integration with additional DeFi protocols
- Mobile-optimized contract interactions

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For questions or support:
- GitHub Issues: [Report bugs or request features](https://github.com/sideway-app/contracts/issues)
- Discord: [Join our community](https://discord.gg/sideway)
- Email: contracts@sideway.app
