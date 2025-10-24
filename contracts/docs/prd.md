# Product Requirements Document (PRD) – Sideway

## Executive Summary

**Tagline**: A collaborative content-idea marketplace with on-chain attribution and revenue sharing via content coins.

**Goal**: Enable creators to post content ideas, invite collaborators dynamically, manage workflow & attribution, and automatically split revenue (in ZORA tokens) by leveraging Zora Labs's Coins Protocol.

## 1. Background & Opportunity

### Problem Statement

Creators frequently have content ideas requiring collaborators (writers, editors, producers), yet managing who gets what share, handling attribution, and distributing revenue is messy and often off-chain. Current solutions lack transparency, automation, and fair revenue distribution mechanisms.

### Solution Overview

Sideway's model starts with creator owning 100% stake, then as collaborators come on board they receive portions of the creator's stake. Revenue is paid in ZORA tokens and the payout recipient of the coin is set to a split contract at minting.

This gives creators flexibility to bring on collaborators after idea posting, and ensures that the on-chain payout flow is automatic from the start (no separate manual routing).

### Market Opportunity

- Growing creator economy with increasing collaboration needs
- Web3-native creators seeking transparent, automated revenue sharing
- Demand for on-chain attribution and immutable payment records
- Integration with established protocols like Zora Labs

## 2. High-Level User Journey

### Creator Path

1. **Connect wallet, create idea post**
   - A content coin is minted via Zora SDK/factory with payoutRecipient set to a new split contract (which currently assigns 100% to the creator)
   - Metadata for the idea (title, description, collateral, collaborator slot count) is stored (e.g., IPFS URI)
   - Idea appears on Sideway marketplace as "open for collaborators"
   - Creator currently has 100% stake

2. **Collaborator Selection**
   - Collaborators browse idea feed, swipe, match
   - Creator selects collaborator(s)
   - For each selected:
     - Off-chain agreement or UI flow to set share percentage (from creator's 100%)
     - On-chain: update the split contract to reflect new distribution
     - Creator's share reduces accordingly, collaborator's share is set
     - Optionally: update the content coin's payoutRecipient (still same contract so revenue routing remains automatic)

3. **Content Creation & Publishing**
   - Work proceeds, content published (credited to creator + collaborators)
   - Revenue (in ZORA tokens) from trading of the coin or other monetisation flows automatically flows to the split contract
   - Revenue splits among creator + collaborators as per shares

4. **Dashboard & Analytics**
   - Dashboard shows each stakeholder's balance, share, payments, and history

### Collaborator Path

1. **Discovery & Application**
   - Connect wallet, browse open ideas
   - Right-swipe/pick idea(s), send interest, await creator's acceptance

2. **Onboarding**
   - Once selected by creator, collaborator's share is recorded on-chain via split contract

3. **Revenue Distribution**
   - After publishing and revenue comes in, collaborator's share of ZORA flows automatically to their wallet via split contract
   - Collaborator can view dashboard for withdrawals or see auto forwarded funds

## 3. Key Features & Requirements

### 3.1 Idea Posting & Content Coin Minting

- **Coin Creation**: At posting time, creator mints via Zora SDK with parameters including creator, name, symbol, metadata.uri, currency = ZORA
- **Payout Recipient**: payoutRecipientOverride is set to address of a freshly deployed split contract owned by creator, initially allocating 100% to creator
- **Metadata Storage**: Idea metadata (title, description, collateral, collaborator slot count) stored on IPFS

### 3.2 Marketplace & Matching Engine

- **Open Feed**: Display of content ideas available for collaboration
- **Swipe Interface**: Collaborators can browse and express interest
- **Creator Selection**: Creator can review and select collaborators

### 3.3 Collaborator Onboarding & Share Assignment

- **Initial State**: Creator has full stake (100%)
- **Dynamic Addition**: When collaborators join, creator assigns a portion of their stake
- **On-chain Updates**: Split contract state changes to reflect new shares
- **Share Management**: Creator can adjust shares and add/remove collaborators

### 3.4 Automatic Payout Recipient Flow

- **Continuous Routing**: Split contract serves as payoutRecipient from coin creation onward
- **Automatic Distribution**: All ZORA token rewards automatically routed to contract and distributed according to shares
- **No Manual Settlement**: Eliminates need for separate manual settlement layer

### 3.5 Revenue Flow & Distribution in ZORA

- **Currency**: Revenue currency is ZORA token (ERC20)
- **Automatic Handling**: System handles ZORA token flows for payout
- **Split Contract**: Handles incoming ZORA token transfers and distributes according to share percentages

### 3.6 Dashboard & Attribution

- **Analytics**: Number of collaborators, share splits, total ZORA received/distributed, pending balance
- **Attribution**: Published content shows creator + collaborator(s) with share percentages
- **History**: Complete transaction and payment history

### 3.7 Share Management

- **Dynamic Updates**: Allow creator to modify distribution to add/remove collaborators
- **Governance**: Audited policy for share changes
- **Transparency**: All changes recorded on-chain with events

## 4. Technical Architecture & Integration

### 4.1 Zora Integration

- **Coin Minting**: Use Zora Coins SDK or factory deploy to mint coin with currency = ZORA
- **Payout Recipient**: Deploy Split Contract (CollaborativePayout) at or before minting with initial share = 100% creator
- **Factory Parameters**: Pass split contract's address as payoutRecipientOverride when calling createCoin

### 4.2 Split Contract Architecture

- **ERC20 Support**: Support ERC20 (ZORA) reception and distribution logic
- **State Management**: Update internal state of split contract (shares array, percentages)
- **Event Emission**: Emit SharesUpdated events for transparency

### 4.3 Revenue Flow

- **Automatic Routing**: Zora protocol sends creator's share of rewards to payoutRecipient (split contract)
- **Distribution**: Split contract distributes or holds for withdrawal
- **Frontend Integration**: Record coin address, split contract address, creator address, collaborator list and shares

### 4.4 Dynamic Management

- **UI Controls**: Allow dynamic add collaborator, set share, trigger on-chain transaction
- **ZORA Handling**: Ensure ZORA token flows (ERC20) are correctly handled
- **Edge Cases**: Handle collaborator declines, wallet changes, departures

## 5. Success Metrics & KPIs

### 5.1 Primary Metrics

- **Ideas Posted**: Number of ideas posted that mint coins with dynamic collaborator onboarding
- **Collaborations Formed**: Number of collaborations formed after idea posting
- **Stake Distribution**: Percent of ideas that shift from 100% creator to multi-stakeholder
- **Revenue Volume**: Volume of ZORA tokens distributed via split contracts

### 5.2 Secondary Metrics

- **Time to Collaboration**: Time from idea posting to collaborator acceptance to coin minting
- **Dashboard Usage**: Average number of collaborators per idea, average share split ratio, number of payouts
- **Engagement**: Collaborators returning for multiple projects, creators posting multiple ideas with collaborators

### 5.3 Platform Health Metrics

- **User Retention**: Monthly active creators and collaborators
- **Revenue Growth**: Month-over-month ZORA token distribution growth
- **Collaboration Success Rate**: Percentage of posted ideas that successfully onboard collaborators

## 6. Consumer Demand & Fit

### 6.1 Creator Benefits

- **Flexibility**: Start solo (100% stake) and bring in dynamic collaborators
- **Automation**: Automatic revenue distribution eliminates manual payment management
- **Transparency**: On-chain attribution provides immutable records

### 6.2 Collaborator Benefits

- **Clarity**: On-chain clarity of share and automatic token payments
- **Fairness**: Transparent, automated payment system
- **Attribution**: Immutable record of contribution and share

### 6.3 Market Fit

- **Web3-Native**: Compelling for Web3-native creator/collaborator market
- **Onboarding Support**: May require onboarding support for less Web3-savvy users
- **Risk Management**: Must communicate realistic expectations about trading volume and rewards

## 7. Technical & Operational Risks

### 7.1 Smart Contract Risks

- **Split Contract Complexity**: Dynamic updates to collaborator list/shares introduce potential vulnerabilities
- **ZORA Token Handling**: Must ensure safe ERC20 handling and contract receives tokens via trading hooks
- **Gas Optimization**: Updates to shares, multiple collaborator payouts must be optimized

### 7.2 Business Risks

- **Timing Issues**: Revenue distributed before collaborator join may not automatically go to them
- **Legal/Contractual**: IP rights and content licensing still require off-chain legal clarity
- **Liquidity Dependence**: If coin trading is minimal, ZORA rewards are low

### 7.3 Technical Risks

- **State Synchronization**: Need robust backend monitoring of coin/trading activities and dashboard updates
- **Edge Cases**: Handle collaborator declines, wallet changes, departures
- **Upgrade Path**: Consider future upgradeability and versioning

## 8. Improvements & Future Enhancements

### 8.1 User Experience

- **Early Collaborator Option**: Creators announce idea, collaborators apply, then creator assigns share
- **Share Negotiation**: UI should guide share negotiation process
- **Custodial Wrapper**: For less Web3-savvy creators, provide seamless wallet onboarding

### 8.2 Revenue Management

- **Revenue Snapshot**: Automatically snapshot coin rewards from collaborator onboard date
- **Historical Revenue**: Clarify fairness for revenue before collaborator join
- **Non-Trading Revenue**: Offer fallback for ad/sponsorship revenue flows

### 8.3 Advanced Features

- **Collaboration Tokens**: Convert collaborator's shares into tradeable collaboration tokens
- **Legal Templates**: Provide template legal contracts for IP attribution + token share assignment
- **Multi-Currency Support**: Support additional tokens beyond ZORA

## 9. MVP Scope

### 9.1 Core Features (MVP)

1. **Creator Posts Idea** → mints content coin (currency = ZORA) → split contract deployed with creator = 100% share
2. **Marketplace**: Collaborators browse and express interest
3. **Collaborator Selection**: Creator selects collaborator → front-end triggers on-chain updateShares in split contract
4. **Automatic Distribution**: ZORA token rewards from content coin trading flow into split contract and are distributed
5. **Dashboard**: Shows balances and wallet addresses for each stakeholder

### 9.2 Future Versions

- Off-chain revenue flows (ad/sponsorship)
- Multi-collaborator multi-share splits
- Advanced analytics and reporting
- Mobile application
- Integration with additional protocols

## 10. Conclusion

Sideway represents a significant opportunity to revolutionize how creators collaborate and share revenue in the Web3 ecosystem. By leveraging Zora's Coins Protocol and implementing dynamic collaborator onboarding with automatic revenue distribution, Sideway addresses key pain points in the creator economy while providing transparency and automation that traditional platforms lack.

The MVP scope focuses on core functionality while providing a foundation for future enhancements. Success will be measured through creator adoption, collaboration formation, and ZORA token distribution volume.

---

*This PRD serves as the foundation for all technical development and product decisions. It should be reviewed and updated regularly as the product evolves.*
