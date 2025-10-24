# Smart Contract Requirements - Sideway

## Overview

This document outlines the detailed smart contract requirements for the Sideway collaborative content-idea marketplace. The architecture uses a clone factory pattern to efficiently deploy payout contracts for each content idea while maintaining gas efficiency and upgradeability.

## Architecture Goals

**Primary Goal**: Instead of deploying a full new payout contract for every content coin, deploy a single implementation once, and then use a factory to create cheap "clone" instances for each idea using a minimal proxy approach. This saves gas and simplifies upgrades/maintenance.

## Smart Contract Flow

### 1. Initial Deployment
1. Deploy `CollaborativePayoutImplementation` (the logic contract)
2. Deploy `CollaborativePayoutFactory` with reference to the implementation address

### 2. Content Coin Creation Flow
1. On new content coin creation: the factory is called (by platform or creator) to create a clone instance via `Clones.clone(...)` from OpenZeppelin
2. Call the clone's `initialize(creator, contentCoin)` method to set up state
3. The clone's address is used as the `payoutRecipient` when calling the Zora Coins SDK `createCoin` for that content coin
4. All rewards (in ZORA tokens) that the Zora protocol sends to the payout recipient flow into that clone instance
5. Clone splits rewards among creator + collaborators as configured

### 3. Collaborator Management
1. When creator adds collaborators later: call `addCollaborator(collab, share)` on the clone
2. This updates the share distribution for that clone only
3. No new contract needs to be deployed for that content coin
4. Backend tracks creator's coin address ↔ clone address ↔ shares

## Why Use Clones?

- **Gas Efficiency**: Each clone shares code with the implementation but has its own storage
- **Cost Savings**: Gas cost per new clone is much lower than full contract deployment (minimal proxy pattern)
- **Maintainability**: Easy to maintain one logic contract, fix bugs there, and future clones use updated logic
- **Scalability**: Avoids the overhead of "one full contract per idea" which would scale poorly

## Contract Specifications

### Interface: ICollaborativePayout

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ICollaborativePayout {
    event FundsReceived(address indexed from, uint256 amount);
    event Payout(address indexed recipient, uint256 amount);
    event SharesUpdated(address[] recipients, uint256[] shares);

    // initialize is used instead of constructor in clone pattern
    function initialize(address creator, address contentCoin) external;

    // Add new collaborator and adjust shares from creator's remaining share
    function addCollaborator(address collaborator, uint256 share) external;

    // View functions
    function getRecipients() external view returns (address[] memory);
    function getShares(address recipient) external view returns (uint256);
    function getTotalReceived() external view returns (uint256);
}
```

### Implementation Contract: CollaborativePayoutImplementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CollaborativePayoutImplementation {
    using SafeERC20 for IERC20;

    address public creator;
    address public contentCoin;
    uint256 public totalSharesBasis; // e.g., 10000 = 100%
    address[] private recipients;
    mapping(address => uint256) private shares;
    uint256 public totalReceived;

    bool private initialized;

    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    function initialize(address _creator, address _contentCoin) external {
        require(!initialized, "Already initialized");
        creator = _creator;
        contentCoin = _contentCoin;
        totalSharesBasis = 10000;
        recipients.push(_creator);
        shares[_creator] = totalSharesBasis;
        initialized = true;
    }

    // Function to receive ZORA token distribution
    function onPayout(IERC20 token, uint256 amount) external {
        require(initialized, "Not initialized");
        // Ideally restrict this to contentCoin or Zora hook only
        totalReceived += amount;
        // Distribute immediately for simplicity
        for (uint i = 0; i < recipients.length; i++) {
            address r = recipients[i];
            uint256 rshare = shares[r];
            if (rshare == 0) continue;
            uint256 pay = (amount * rshare) / totalSharesBasis;
            token.safeTransfer(r, pay);
            emit Payout(r, pay);
        }
    }

    function addCollaborator(address collaborator, uint256 share) external onlyCreator {
        require(initialized, "Not init");
        require(collaborator != address(0), "Zero address");
        require(share > 0, "Zero share");
        uint256 creatorShare = shares[creator];
        require(creatorShare > share, "Creator share too small");

        // reduce creator share
        shares[creator] = creatorShare - share;

        // add collaborator
        recipients.push(collaborator);
        shares[collaborator] = share;

        // emit event
        emit SharesUpdated(recipients, _getSharesArray());
    }

    function getRecipients() external view returns(address[] memory) {
        return recipients;
    }

    function getShares(address recipient) external view returns (uint256) {
        return shares[recipient];
    }

    function getTotalReceived() external view returns(uint256) {
        return totalReceived;
    }

    // internal helper to gather shares array
    function _getSharesArray() internal view returns (uint256[] memory) {
        uint256 len = recipients.length;
        uint256[] memory arr = new uint256[](len);
        for (uint i = 0; i < len; i++) {
            arr[i] = shares[recipients[i]];
        }
        return arr;
    }
}
```

### Factory Contract: CollaborativePayoutFactory

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract CollaborativePayoutFactory {
    address public immutable implementation;
    address[] public allClones;

    event CloneCreated(address indexed cloneAddress, address creator, address contentCoin);

    constructor(address _implementation) {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
    }

    function createPayout(address creator, address contentCoin) external returns (address cloneAddr) {
        cloneAddr = Clones.clone(implementation);
        CollaborativePayoutImplementation(payable(cloneAddr)).initialize(creator, contentCoin);
        allClones.push(cloneAddr);
        emit CloneCreated(cloneAddr, creator, contentCoin);
    }

    function allClonesCount() external view returns(uint256) {
        return allClones.length;
    }
}
```

## Functional Requirements

### 1. Split/Revenue-Sharing Contract (CollaborativePayoutImplementation)

#### Initialization
- On deployment, the contract receives:
  - `creator` address
  - `contentCoin` address
  - Initial recipient list (for MVP: just the creator)
  - Initial shares: creator = 100% (or defined in basis points)

#### State Management
- Store array of recipient addresses
- Store mapping `shares[recipient]` (in basis points or percentage)
- Store total shares (must equal defined denominator, e.g. 10000 = 100%)

#### Core Functions
- `initialize(address creator, address contentCoin)`: Set up initial state for clone
- `addCollaborator(address collaborator, uint256 share)`: Reduce creator's share, add collaborator with share
- `updateShare(address recipient, uint256 newShare)`: Adjust share for existing recipient
- `onPayout(IERC20 token, uint256 amount)`: Handle incoming ZORA token distributions

#### Share Management
- Enforce share invariants: sum of all shares = denominator (e.g., 10,000 basis points = 100%)
- No address gets 0 share
- Only creator can add/remove collaborators initially

#### ZORA Token Handling
- Support receiving ZORA tokens (ERC20)
- On receipt of ZORA tokens:
  - Either auto-forward (push model) to each recipient proportionally
  - Or accumulate balances per recipient and allow withdrawal (pull model)
- Use SafeERC20 library for safe token transfers

#### Events
- `FundsReceived(address indexed from, uint256 amount)`
- `Payout(address indexed recipient, uint256 amount)`
- `SharesUpdated(address[] recipients, uint256[] shares)`

#### Query Functions
- `getRecipients()` returns `(address[] memory)`
- `getShares(address recipient)` returns `(uint256)`
- `getPendingBalance(address recipient)` returns `(uint256)` (if pull model)
- `getTotalReceived()`, `getTotalDistributed()`

### 2. Factory Contract (CollaborativePayoutFactory)

#### Core Functions
- `createPayout(address creator, address contentCoin)`: Create new clone instance
- `allClonesCount()`: Return total number of clones created

#### Events
- `CloneCreated(address indexed cloneAddress, address creator, address contentCoin)`

## Integration Requirements

### 1. Zora Protocol Integration

#### Coin Deployment
- Use Zora Coins SDK or factory deploy to mint coin with `currency = ZORA`
- Deploy CollaborativePayout clone at or before minting
- Pass clone contract's address as `payoutRecipientOverride` when calling `createCoin`
- Set `currency = ZORA` so backing currency and rewards are denominated in ZORA token

#### Payout Recipient Setup
- The clone contract serves as `payoutRecipient` from coin creation onward
- All future creator rewards from trading activity go to this contract
- Split contract distributes or holds for withdrawal

### 2. Revenue Flow & Token Handling

#### Automatic Distribution
- System assumes receipt of ZORA tokens into the CollaborativePayout clone
- For auto-forwarding model: On token receipt, contract triggers proportional transfers
- For pull model: Track pending balances and provide withdraw function

#### Security Considerations
- Guard against ERC20 tokens with transfer fees
- Protect against reentrancy (use ReentrancyGuard)
- Handle edge conditions (collaborator added after rewards distributed)

### 3. Frontend/Backend Integration

#### Data Tracking
- When metadata minted, record:
  - Coin address
  - Clone contract address
  - Creator address
  - Collaborator list and shares

#### UI Controls
- Allow dynamic: add collaborator, set share, trigger on-chain transaction
- Ensure ZORA token flows (ERC20) are correctly handled
- Handle edge conditions (collaborator declines, wallet changes, departures)

## Security Requirements

### 1. Access Control
- Only creator (or authorized party) can add collaborators/update shares
- Consider collaborator acceptance mechanism for MVP
- Implement pause function for dispute resolution

### 2. Token Safety
- Use SafeERC20 library for all token operations
- Implement reentrancy protection
- Validate share sums and prevent zero shares

### 3. Edge Case Handling
- Handle invalid recipient addresses (lost keys)
- Manage collaborator departures
- Clarify revenue sharing for historical vs. future revenue

## Gas Optimization

### 1. Efficiency Measures
- Keep number of recipients small initially (1–3) to avoid large loops
- Use minimal proxy pattern for clone deployment
- Optimize share calculation and distribution logic

### 2. Scalability Considerations
- Limit initial collaborator count for MVP
- Consider batch operations for multiple collaborator additions
- Implement efficient storage patterns

## Upgrade Path

### 1. Implementation Updates
- Deploy new implementation contract for bug fixes or feature additions
- Update factory to use new implementation address
- Existing clones continue using old implementation

### 2. Future Enhancements
- Consider upgradeable proxy pattern for major changes
- Implement versioning system for contract interfaces
- Plan for migration strategies if needed

## Integration Notes

### 1. Deployment Flow
1. Call factory before minting content coin to get clone address
2. Use clone address as `payoutRecipient` in Zora coin creation
3. Backend maps contentCoin address → clone address → recipients/shares

### 2. Zora Integration
- Ensure Zora's reward hook is directed to clone contract address
- Verify Zora's distribution sends ZORA token to payout address
- Implement appropriate token receiver pattern (`receive()`, `tokenFallback`, or ERC20 receiver)

### 3. Event Monitoring
- Monitor `SharesUpdated` and `Payout` events for UI/dashboard indexing
- Track clone creation events for backend state management
- Implement event filtering for efficient data retrieval

## Testing Requirements

### 1. Unit Tests
- Test clone initialization and state setup
- Verify share calculation and distribution logic
- Test collaborator addition and share updates
- Validate access control mechanisms

### 2. Integration Tests
- Test Zora coin creation with clone as payout recipient
- Verify ZORA token distribution flow
- Test factory clone creation and initialization
- Validate event emission and indexing

### 3. Security Tests
- Test reentrancy protection
- Verify access control restrictions
- Test edge cases and error conditions
- Validate token transfer safety

## Deployment Checklist

### 1. Pre-Deployment
- [ ] Deploy CollaborativePayoutImplementation
- [ ] Deploy CollaborativePayoutFactory with implementation address
- [ ] Verify implementation contract functionality
- [ ] Test factory clone creation

### 2. Integration Testing
- [ ] Test Zora coin creation with clone payout recipient
- [ ] Verify ZORA token distribution
- [ ] Test collaborator addition flow
- [ ] Validate event emission

### 3. Production Deployment
- [ ] Deploy to target network (Base chain)
- [ ] Verify contract addresses and initialization
- [ ] Test end-to-end flow with real Zora integration
- [ ] Monitor initial transactions and events

---

*This specification serves as the technical foundation for smart contract development. It should be reviewed and updated as implementation progresses and requirements evolve.*
