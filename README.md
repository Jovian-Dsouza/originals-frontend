# Originals

**A collaborative content-idea marketplace with on-chain attribution and revenue sharing via content coins.**

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square&logo=base)](https://base.org)
[![Zora Protocol](https://img.shields.io/badge/Powered%20by-Zora%20Protocol-000000?style=flat-square)](https://zora.co)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

## 🎯 Problem Statement

Creators frequently have content ideas requiring collaborators (writers, editors, producers), yet managing who gets what share, handling attribution, and distributing revenue is messy and often off-chain. Originals solves this by leveraging Zora's Coins Protocol to create a transparent, on-chain collaboration marketplace.

## ✨ Key Features

### 🚀 **Dynamic Collaboration Model**
- Creators start with 100% stake in their content coin
- Collaborators can be added dynamically with automatic share redistribution
- On-chain attribution ensures transparent ownership

### 💰 **Automatic Revenue Sharing**
- Revenue flows automatically in ZORA tokens via smart contracts
- No manual payout management required
- Real-time balance tracking for all stakeholders

### 🎨 **Content Coin Integration**
- Built on Zora's Coins Protocol
- Each collaboration idea gets its own content coin
- Trading and monetization through Zora's infrastructure
- The content coin acts like a content capital market instead of just speculation

### 🔗 **Smart Contract Architecture**
- `CollaborativePayoutFactory`: Deploys payout contracts for each collaboration
- `CollaborativePayoutImplementation`: Handles dynamic share management and payouts
- Gas-optimized using OpenZeppelin's Clones pattern

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **Privy** for wallet authentication
- **TanStack Query** for data fetching
- **React Router** for navigation

### Smart Contracts
- **Solidity ^0.8.20**
- **Foundry** for development and testing
- **OpenZeppelin** contracts for security
- **Base** blockchain deployment

### Key Integrations
- **Zora Coins SDK** for content coin management
- **IPFS** for decentralized metadata storage
- **Base** blockchain for low-cost transactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/originals-frontend.git
   cd originals-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (Privy app ID, API endpoints, etc.)

4. **Start the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Smart Contract Development

1. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

2. **Install Foundry** (if not already installed)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. **Install dependencies**
   ```bash
   forge install
   ```

4. **Compile contracts**
   ```bash
   forge build
   ```

5. **Run tests**
   ```bash
   forge test
   ```

## 📱 User Journey

### Creator Path
1. **Connect wallet** and create idea post
2. **Content coin minted** via Zora SDK with payout recipient set to split contract
3. **Idea appears** on marketplace as "open for collaborators"
4. **Select collaborators** and assign share percentages
5. **Automatic revenue distribution** in ZORA tokens

### Collaborator Path
1. **Browse open ideas** on the marketplace
2. **Express interest** through swipe/matching system
3. **Get selected** by creator and receive on-chain share
4. **Automatic payouts** when revenue flows in

## 🔧 Smart Contract Details

### CollaborativePayoutFactory
- Deploys new payout contracts for each collaboration
- Maps creators and content coins to their payout contracts
- Uses OpenZeppelin's Clones for gas efficiency

### CollaborativePayoutImplementation
- **Dynamic Share Management**: Add collaborators with automatic share redistribution
- **Automatic Payouts**: Receives ZORA tokens and distributes according to shares
- **Withdrawal System**: Collaborators can withdraw their pending balances
- **Event Logging**: Comprehensive events for transparency

## 🎨 Frontend Features

### Pages
- **Onboarding**: Wallet connection and user setup
- **Post Feed**: Browse and discover collaboration opportunities
- **Collab Feed**: Manage your collaborations
- **Create Collab**: Post new collaboration ideas
- **Create Content**: Publish content with proper attribution
- **Profile**: View your portfolio and earnings
- **Contracts**: Monitor smart contract interactions

### Components
- **CollabCard**: Display collaboration opportunities
- **MatchCard**: Show potential collaborator matches
- **PingCard**: Notification system for collaboration updates
- **UserProfileDisplay**: Showcase creator profiles
- **GuidedTour**: Onboarding experience for new users

## 🔐 Security Features

- **OpenZeppelin Contracts**: Battle-tested security patterns
- **SafeERC20**: Secure token transfers
- **Access Control**: Creator-only functions for share management
- **Input Validation**: Comprehensive parameter checking
- **Event Logging**: Full transparency of all operations

## 📊 Success Metrics

- Number of ideas posted with dynamic collaborator onboarding
- Volume of ZORA tokens distributed via split contracts
- Average number of collaborators per idea
- Time from idea posting to collaborator acceptance
- Creator and collaborator retention rates

## 🛠️ Development

### Available Scripts
```bash
# Frontend
bun dev          # Start development server
bun build        # Build for production
bun preview      # Preview production build
bun lint         # Run ESLint

# Smart Contracts
forge build      # Compile contracts
forge test       # Run tests
forge deploy     # Deploy to network
```

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── services/      # API and blockchain services
├── types/         # TypeScript type definitions
├── lib/           # Utility functions and configurations
└── contexts/      # React contexts (Wallet, etc.)

contracts/
├── src/           # Smart contract source files
├── test/          # Contract tests
└── script/        # Deployment scripts
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zora Labs** for the Coins Protocol infrastructure
- **Base** for the low-cost, fast blockchain
- **OpenZeppelin** for secure smart contract patterns
- **Privy** for seamless wallet integration

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/originals-frontend/issues)
- **Discord**: [Join our community](https://discord.gg/your-discord)

---

**Built with ❤️ for the creator economy on Base**
