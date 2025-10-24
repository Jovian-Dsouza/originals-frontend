# Deployment Guide - Sideway

## Overview

This guide provides step-by-step instructions for deploying the Sideway platform, including smart contracts, backend services, and frontend applications.

## Prerequisites

### Development Environment
- Node.js 18+ and npm/yarn
- Foundry (for smart contract development)
- Docker and Docker Compose
- Git

### Blockchain Requirements
- Base network access (testnet/mainnet)
- ETH for gas fees
- ZORA token for testing

### Infrastructure Requirements
- Cloud provider account (AWS, GCP, Azure)
- Domain name for production
- SSL certificates
- Database hosting

## Smart Contract Deployment

### 1. Environment Setup

#### Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Clone Repository
```bash
git clone https://github.com/your-org/sideway.git
cd sideway
```

#### Install Dependencies
```bash
forge install
```

### 2. Configuration

#### Environment Variables
Create `.env` file:
```bash
# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_TESTNET_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here

# Zora Configuration
ZORA_COIN_FACTORY=0x...
ZORA_TOKEN=0x...

# IPFS Configuration
IPFS_GATEWAY=https://ipfs.io/ipfs/
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

#### Foundry Configuration
Update `foundry.toml`:
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.17"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
base = "https://mainnet.base.org"
base_testnet = "https://sepolia.base.org"

[etherscan]
base = { key = "your_etherscan_key", url = "https://api.basescan.org/api" }
```

### 3. Contract Deployment

#### Deploy Implementation Contract
```bash
# Deploy to Base testnet
forge create src/CollaborativePayoutImplementation.sol:CollaborativePayoutImplementation \
  --rpc-url base_testnet \
  --private-key $PRIVATE_KEY \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

#### Deploy Factory Contract
```bash
# Deploy factory with implementation address
forge create src/CollaborativePayoutFactory.sol:CollaborativePayoutFactory \
  --constructor-args $IMPLEMENTATION_ADDRESS \
  --rpc-url base_testnet \
  --private-key $PRIVATE_KEY \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

#### Deployment Script
Create `script/Deploy.s.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/CollaborativePayoutImplementation.sol";
import "../src/CollaborativePayoutFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy implementation
        CollaborativePayoutImplementation implementation = new CollaborativePayoutImplementation();
        
        // Deploy factory
        CollaborativePayoutFactory factory = new CollaborativePayoutFactory(address(implementation));
        
        vm.stopBroadcast();
        
        console.log("Implementation deployed at:", address(implementation));
        console.log("Factory deployed at:", address(factory));
    }
}
```

Run deployment:
```bash
forge script script/Deploy.s.sol --rpc-url base_testnet --broadcast
```

### 4. Contract Verification

#### Verify on Etherscan
```bash
forge verify-contract \
  --chain-id 8453 \
  --num-of-optimizations 200 \
  --watch \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  $CONTRACT_ADDRESS \
  src/CollaborativePayoutImplementation.sol:CollaborativePayoutImplementation
```

## Backend Deployment

### 1. Environment Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create `.env`:
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sideway
REDIS_URL=redis://localhost:6379

# Blockchain
BASE_RPC_URL=https://mainnet.base.org
FACTORY_ADDRESS=0x...
IMPLEMENTATION_ADDRESS=0x...
ZORA_COIN_FACTORY=0x...
ZORA_TOKEN=0x...

# IPFS
IPFS_GATEWAY=https://ipfs.io/ipfs/
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### 2. Database Setup

#### PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql
```

#### Database Creation
```bash
# Create database
sudo -u postgres createdb sideway

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

#### Redis Installation
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis
brew services start redis
```

### 3. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/sideway
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=sideway
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

### 4. Production Deployment

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Ecosystem Configuration
```javascript
module.exports = {
  apps: [{
    name: 'sideway-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Frontend Deployment

### 1. Build Configuration

#### Environment Variables
Create `.env.production`:
```bash
VITE_API_URL=https://api.sideway.app
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_FACTORY_ADDRESS=0x...
VITE_ZORA_COIN_FACTORY=0x...
VITE_ZORA_TOKEN=0x...
```

#### Build Process
```bash
cd frontend
npm install
npm run build
```

### 2. Static Hosting

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. CDN Configuration

#### Cloudflare Setup
1. Add domain to Cloudflare
2. Configure DNS records
3. Enable SSL/TLS
4. Configure caching rules
5. Enable compression

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name sideway.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name sideway.app;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/sideway/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

## Monitoring and Maintenance

### 1. Health Checks

#### Backend Health Check
```bash
curl https://api.sideway.app/health
```

#### Database Health Check
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

#### Redis Health Check
```bash
redis-cli ping
```

### 2. Logging

#### Application Logs
```bash
# PM2 logs
pm2 logs sideway-backend

# Docker logs
docker-compose logs -f backend
```

#### System Logs
```bash
# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u sideway-backend -f
```

### 3. Monitoring Setup

#### Prometheus Configuration
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'sideway-backend'
    static_configs:
      - targets: ['localhost:3000']
```

#### Grafana Dashboard
1. Install Grafana
2. Configure Prometheus data source
3. Import Sideway dashboard
4. Set up alerts

### 4. Backup Strategy

#### Database Backup
```bash
# Daily backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/sideway_$DATE.sql
aws s3 cp /backups/sideway_$DATE.sql s3://sideway-backups/
```

#### Contract State Backup
```bash
# Export contract state
cast call $FACTORY_ADDRESS "allClonesCount()" --rpc-url $BASE_RPC_URL
```

## Security Considerations

### 1. Environment Security
- Use environment variables for secrets
- Implement proper access controls
- Regular security updates
- SSL/TLS encryption

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups
- Access logging

### 3. Smart Contract Security
- Verify contracts on Etherscan
- Monitor for suspicious activity
- Regular security audits
- Emergency pause mechanisms

## Troubleshooting

### Common Issues

#### Contract Deployment Fails
```bash
# Check gas limit
forge create ... --gas-limit 10000000

# Check network connection
cast block-number --rpc-url $BASE_RPC_URL
```

#### Database Connection Issues
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql $DATABASE_URL -c "SELECT version();"
```

#### Frontend Build Issues
```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install

# Check environment variables
npm run build -- --mode production
```

### Support Resources
- Documentation: `/docs`
- GitHub Issues: `https://github.com/your-org/sideway/issues`
- Discord: `https://discord.gg/sideway`
- Email: `support@sideway.app`

---

*This deployment guide provides comprehensive instructions for setting up the Sideway platform. Follow the steps carefully and refer to the troubleshooting section if issues arise.*
