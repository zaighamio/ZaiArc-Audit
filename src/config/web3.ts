import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';

export const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
} as const;

export const CONTRACT_ADDRESS = '0xd0C6439C34aC0588D3b5786C3E087e06c317ee8e';
export const OWNER_ADDRESS = '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e';

export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
export const EURC_ADDRESS = '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a';

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"name": "_projectName", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_contractAddress", "type": "string"},
      {"name": "_rewardLow", "type": "uint256"},
      {"name": "_rewardMedium", "type": "uint256"},
      {"name": "_rewardHigh", "type": "uint256"},
      {"name": "_rewardCritical", "type": "uint256"},
      {"name": "_rewardToken", "type": "address"},
      {"name": "_totalPool", "type": "uint256"}
    ],
    "name": "createBounty",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_bountyId", "type": "uint256"},
      {"name": "_title", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_proofOfConcept", "type": "string"},
      {"name": "_severity", "type": "uint8"}
    ],
    "name": "submitReport",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "name": "approveReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "name": "rejectReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_bountyId", "type": "uint256"},
      {"name": "_status", "type": "uint8"}
    ],
    "name": "updateBountyStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_bountyId", "type": "uint256"}],
    "name": "withdrawRemainingPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_bountyId", "type": "uint256"}],
    "name": "getBounty",
    "outputs": [{"name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "name": "getReport",
    "outputs": [{"name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_bountyId", "type": "uint256"}],
    "name": "getBountyReports",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_creator", "type": "address"}],
    "name": "getCreatorBounties",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_researcher", "type": "address"}],
    "name": "getResearcherReports",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBounties",
    "outputs": [{"name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPlatformStats",
    "outputs": [
      {"name": "_totalBounties", "type": "uint256"},
      {"name": "_totalReports", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_researcher", "type": "address"}],
    "name": "getTotalEarned",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bountyCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reportCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Token ERC20 Mini-ABI for ERC20 approvals
export const ERC20_ABI = [
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'ZaiArc Audit',
  projectId: '028e2da8ea78acf195fc0d60402e0c8a',
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
});
