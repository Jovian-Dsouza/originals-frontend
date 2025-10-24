# Sideway - Collaborative Content Marketplace

A collaborative content-idea marketplace with on-chain attribution and revenue sharing via content coins, built on Base network with Zora Protocol integration.

## 🚀 Project Overview

Sideway enables creators to post content ideas, invite collaborators dynamically, manage workflow & attribution, and automatically split revenue in ZORA tokens by leveraging Zora Labs's Coins Protocol.

### Key Features

- **Dynamic Collaborator Onboarding**: Creators start with 100% stake and can add collaborators later
- **Automatic Revenue Sharing**: Revenue flows automatically through split contracts
- **On-chain Attribution**: All shares and payments are recorded on-chain
- **ZORA Token Integration**: Revenue is distributed in ZORA tokens
- **Content Coin Minting**: Ideas are represented as tradeable content coins

## 📁 Project Structure

```
sideway/
├── src/                    # Smart contracts (Solidity)
├── test/                   # Contract tests
├── script/                 # Deployment scripts
├── frontend/               # Next.js frontend application
├── docs/                   # Comprehensive documentation
└── lib/                    # External dependencies (gitignored)
```

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity**: ^0.8.20
- **Foundry**: Development framework
- **OpenZeppelin**: Security libraries
- **Base Network**: Ethereum L2

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Wagmi + Reown AppKit**: Web3 wallet integration
- **React Query**: State management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Foundry
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-org/sideway.git
cd sideway
```

### 2. Smart Contracts Setup
```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy (set up .env first)
forge script script/Deploy.s.sol --rpc-url base_testnet --broadcast
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Fill in your WalletConnect Project ID and contract addresses

# Start development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Documentation: See `/docs` folder

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Product Requirements Document](./docs/prd.md) - Complete product specification
- [Smart Contract Requirements](./docs/smart-contract-requirements.md) - Technical specifications
- [Smart Contracts Implementation](./docs/smart-contracts.md) - Contract documentation
- [Technical Architecture](./docs/technical-architecture.md) - System design
- [API Specification](./docs/api-specification.md) - Frontend integration
- [Deployment Guide](./docs/deployment-guide.md) - Setup instructions
- [User Guide](./docs/user-guide.md) - End-user documentation

## 🔧 Development

### Smart Contracts
```bash
# Build contracts
forge build

# Run tests
forge test

# Format code
forge fmt

# Gas snapshots
forge snapshot
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 🏗️ Architecture

### Smart Contract Architecture
- **Clone Factory Pattern**: Gas-efficient deployment using minimal proxies
- **CollaborativePayoutImplementation**: Main logic contract
- **CollaborativePayoutFactory**: Factory for deploying clones
- **Zora Integration**: Automatic revenue distribution via protocol hooks

### Frontend Architecture
- **App Router**: Next.js 14 with server components
- **Web3 Integration**: Wagmi + Reown AppKit for wallet connectivity
- **Component Library**: Custom UI components with Tailwind CSS
- **State Management**: React Query for server state

## 🔐 Security

- **Access Control**: Role-based permissions
- **Safe Token Operations**: SafeERC20 library
- **Input Validation**: Comprehensive checks
- **Reentrancy Protection**: External calls after state updates

## 🌐 Networks

- **Base Mainnet**: Production deployment
- **Base Sepolia**: Testnet for development
- **Local Anvil**: Local development

## 📈 Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics
- [ ] Mobile application
- [ ] AI-powered matching
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: `/docs` folder
- **GitHub Issues**: [Report bugs](https://github.com/sideway-app/issues)
- **Discord**: [Join community](https://discord.gg/sideway)
- **Email**: hello@sideway.app

---

Built with ❤️ for the Web3 creator economy
