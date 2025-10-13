/**
 * RPC and API endpoint helper utilities
 *
 * Provides helper functions to build RPC endpoints and block explorer API URLs
 * from API keys and chain identifiers.
 */

import { Chain, ChainType } from '@sudobility/types';
import { Optional } from '@sudobility/types';
import type { ChainConfig } from '@sudobility/types';

/**
 * Blockchain API keys configuration
 */
export interface BlockchainApis {
  /** Alchemy API key for RPC access (supports both EVM and Solana) */
  alchemyApiKey: string;
  /** Etherscan Multichain API key for block explorer API access (EVM only) */
  etherscanApiKey: string;
}

/**
 * Consolidated chain information structure
 * Contains all static metadata about a blockchain network
 */
export interface ChainInfo {
  /** Chain type (EVM or Solana) */
  chainType: ChainType;
  /** Numeric chain ID (positive for EVM, negative for Solana) */
  chainId: number;
  /** User-friendly display name */
  name: string;
  /** Alchemy network identifier for RPC endpoints */
  alchemyNetwork: string;
  /** Block explorer API domain (empty for Solana and unsupported chains) */
  explorerDomain: string;
  /** Block explorer browser domain */
  explorerBrowserDomain: string;
  /** USDC contract address (EVM) or mint address (Solana) */
  usdcAddress: string;
  /** Whether this is a development/testnet chain (true) or mainnet/production chain (false) */
  isDev: boolean;
  /** Optional deployed mailer contract address (EVM chains only) */
  mailerAddress?: string;
  /** Optional block number where the mailer contract was deployed (used for event indexing) */
  startingBlock?: number;
}

/**
 * Consolidated chain information map
 * Contains all static metadata for each supported blockchain network
 */
const CHAIN_INFO_MAP: Record<Chain, ChainInfo> = {
  // Ethereum
  [Chain.ETH_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 1,
    name: 'Ethereum',
    alchemyNetwork: 'eth-mainnet',
    explorerDomain: 'api.etherscan.io',
    explorerBrowserDomain: 'etherscan.io',
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    isDev: false,
  },
  [Chain.ETH_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    alchemyNetwork: 'eth-sepolia',
    explorerDomain: 'api-sepolia.etherscan.io',
    explorerBrowserDomain: 'sepolia.etherscan.io',
    usdcAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    isDev: true,
    mailerAddress: '0x7f20be6adae02c4640979afd86e56da288efab3e',
    startingBlock: 9403932,
  },
  [Chain.ETH_GOERLI]: {
    chainType: ChainType.EVM,
    chainId: 5,
    name: 'Ethereum Goerli',
    alchemyNetwork: 'eth-goerli',
    explorerDomain: 'api-goerli.etherscan.io',
    explorerBrowserDomain: 'goerli.etherscan.io',
    usdcAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    isDev: true,
  },

  // Polygon
  [Chain.POLYGON_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 137,
    name: 'Polygon',
    alchemyNetwork: 'polygon-mainnet',
    explorerDomain: 'api.polygonscan.com',
    explorerBrowserDomain: 'polygonscan.com',
    usdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    isDev: false,
  },
  [Chain.POLYGON_MUMBAI]: {
    chainType: ChainType.EVM,
    chainId: 80001,
    name: 'Polygon Mumbai',
    alchemyNetwork: 'polygon-mumbai',
    explorerDomain: 'api-testnet.polygonscan.com',
    explorerBrowserDomain: 'mumbai.polygonscan.com',
    usdcAddress: '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
    isDev: true,
  },
  [Chain.POLYGON_AMOY]: {
    chainType: ChainType.EVM,
    chainId: 80002,
    name: 'Polygon Amoy',
    alchemyNetwork: 'polygon-amoy',
    explorerDomain: 'api-amoy.polygonscan.com',
    explorerBrowserDomain: 'amoy.polygonscan.com',
    usdcAddress: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    isDev: true,
  },

  // Optimism
  [Chain.OPTIMISM_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 10,
    name: 'Optimism',
    alchemyNetwork: 'opt-mainnet',
    explorerDomain: 'api-optimistic.etherscan.io',
    explorerBrowserDomain: 'optimistic.etherscan.io',
    usdcAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    isDev: false,
  },
  [Chain.OPTIMISM_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 11155420,
    name: 'Optimism Sepolia',
    alchemyNetwork: 'opt-sepolia',
    explorerDomain: 'api-sepolia-optimistic.etherscan.io',
    explorerBrowserDomain: 'sepolia-optimistic.etherscan.io',
    usdcAddress: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    isDev: true,
  },
  [Chain.OPTIMISM_GOERLI]: {
    chainType: ChainType.EVM,
    chainId: 420,
    name: 'Optimism Goerli',
    alchemyNetwork: 'opt-goerli',
    explorerDomain: 'api-goerli-optimistic.etherscan.io',
    explorerBrowserDomain: 'goerli-optimistic.etherscan.io',
    usdcAddress: '0xe05606174bac4A6364B31bd0eCA4bf4dD368f8C6',
    isDev: true,
  },

  // Arbitrum
  [Chain.ARBITRUM_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 42161,
    name: 'Arbitrum',
    alchemyNetwork: 'arb-mainnet',
    explorerDomain: 'api.arbiscan.io',
    explorerBrowserDomain: 'arbiscan.io',
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    isDev: false,
  },
  [Chain.ARBITRUM_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    alchemyNetwork: 'arb-sepolia',
    explorerDomain: 'api-sepolia.arbiscan.io',
    explorerBrowserDomain: 'sepolia.arbiscan.io',
    usdcAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    isDev: true,
  },
  [Chain.ARBITRUM_GOERLI]: {
    chainType: ChainType.EVM,
    chainId: 421613,
    name: 'Arbitrum Goerli',
    alchemyNetwork: 'arb-goerli',
    explorerDomain: 'api-goerli.arbiscan.io',
    explorerBrowserDomain: 'goerli.arbiscan.io',
    usdcAddress: '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63',
    isDev: true,
  },

  // Base
  [Chain.BASE_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 8453,
    name: 'Base',
    alchemyNetwork: 'base-mainnet',
    explorerDomain: 'api.basescan.org',
    explorerBrowserDomain: 'basescan.org',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    isDev: false,
  },
  [Chain.BASE_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 84532,
    name: 'Base Sepolia',
    alchemyNetwork: 'base-sepolia',
    explorerDomain: 'api-sepolia.basescan.org',
    explorerBrowserDomain: 'sepolia.basescan.org',
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    isDev: true,
  },
  [Chain.BASE_GOERLI]: {
    chainType: ChainType.EVM,
    chainId: 84531,
    name: 'Base Goerli',
    alchemyNetwork: 'base-goerli',
    explorerDomain: 'api-goerli.basescan.org',
    explorerBrowserDomain: 'goerli.basescan.org',
    usdcAddress: '0xF175520C52418dfE19C8098071a252da48Cd1C19',
    isDev: true,
  },

  // Avalanche
  [Chain.AVALANCHE_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 43114,
    name: 'Avalanche',
    alchemyNetwork: 'avax-mainnet',
    explorerDomain: 'api.snowtrace.io',
    explorerBrowserDomain: 'snowtrace.io',
    usdcAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    isDev: false,
  },
  [Chain.AVALANCHE_FUJI]: {
    chainType: ChainType.EVM,
    chainId: 43113,
    name: 'Avalanche Fuji',
    alchemyNetwork: 'avax-fuji',
    explorerDomain: 'api-testnet.snowtrace.io',
    explorerBrowserDomain: 'testnet.snowtrace.io',
    usdcAddress: '0x5425890298aed601595a70AB815c96711a31Bc65',
    isDev: true,
  },

  // BNB Chain
  [Chain.BNB_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 56,
    name: 'BNB Chain',
    alchemyNetwork: 'bnb-mainnet',
    explorerDomain: 'api.bscscan.com',
    explorerBrowserDomain: 'bscscan.com',
    usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    isDev: false,
  },
  [Chain.BNB_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 97,
    name: 'BNB Chain Testnet',
    alchemyNetwork: 'bnb-testnet',
    explorerDomain: 'api-testnet.bscscan.com',
    explorerBrowserDomain: 'testnet.bscscan.com',
    usdcAddress: '0x64544969ed7EBf5f083679233325356EbE738930',
    isDev: true,
  },

  // Gnosis Chain
  [Chain.GNOSIS_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 100,
    name: 'Gnosis',
    alchemyNetwork: 'gnosis-mainnet',
    explorerDomain: 'api.gnosisscan.io',
    explorerBrowserDomain: 'gnosisscan.io',
    usdcAddress: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    isDev: false,
  },
  [Chain.GNOSIS_CHIADO]: {
    chainType: ChainType.EVM,
    chainId: 10200,
    name: 'Gnosis Chiado',
    alchemyNetwork: 'gnosis-chiado',
    explorerDomain: 'api-chiado.gnosisscan.io',
    explorerBrowserDomain: 'gnosis-chiado.blockscout.com',
    usdcAddress: '0x',
    isDev: true,
  },

  // Celo
  [Chain.CELO_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 42220,
    name: 'Celo',
    alchemyNetwork: 'celo-mainnet',
    explorerDomain: 'api.celoscan.io',
    explorerBrowserDomain: 'celoscan.io',
    usdcAddress: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    isDev: false,
  },
  [Chain.CELO_ALFAJORES]: {
    chainType: ChainType.EVM,
    chainId: 44787,
    name: 'Celo Alfajores',
    alchemyNetwork: 'celo-alfajores',
    explorerDomain: 'api-alfajores.celoscan.io',
    explorerBrowserDomain: 'alfajores.celoscan.io',
    usdcAddress: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
    isDev: true,
  },

  // zkSync
  [Chain.ZKSYNC_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 324,
    name: 'zkSync',
    alchemyNetwork: 'zksync-mainnet',
    explorerDomain: 'api-era.zksync.network',
    explorerBrowserDomain: 'explorer.zksync.io',
    usdcAddress: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    isDev: false,
  },
  [Chain.ZKSYNC_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 300,
    name: 'zkSync Sepolia',
    alchemyNetwork: 'zksync-sepolia',
    explorerDomain: 'api-sepolia-era.zksync.network',
    explorerBrowserDomain: 'sepolia.explorer.zksync.io',
    usdcAddress: '0x',
    isDev: true,
  },

  // Linea
  [Chain.LINEA_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 59144,
    name: 'Linea',
    alchemyNetwork: 'linea-mainnet',
    explorerDomain: 'api.lineascan.build',
    explorerBrowserDomain: 'lineascan.build',
    usdcAddress: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    isDev: false,
  },
  [Chain.LINEA_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 59141,
    name: 'Linea Sepolia',
    alchemyNetwork: 'linea-sepolia',
    explorerDomain: 'api-sepolia.lineascan.build',
    explorerBrowserDomain: 'sepolia.lineascan.build',
    usdcAddress: '0x',
    isDev: true,
  },

  // Scroll
  [Chain.SCROLL_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 534352,
    name: 'Scroll',
    alchemyNetwork: 'scroll-mainnet',
    explorerDomain: 'api.scrollscan.com',
    explorerBrowserDomain: 'scrollscan.com',
    usdcAddress: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    isDev: false,
  },
  [Chain.SCROLL_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 534351,
    name: 'Scroll Sepolia',
    alchemyNetwork: 'scroll-sepolia',
    explorerDomain: 'api-sepolia.scrollscan.com',
    explorerBrowserDomain: 'sepolia.scrollscan.com',
    usdcAddress: '0x',
    isDev: true,
  },

  // Monad
  [Chain.MONAD_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 10000,
    name: 'Monad',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.monad.xyz',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.MONAD_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 10001,
    name: 'Monad Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.monad.xyz',
    usdcAddress: '0x',
    isDev: true,
  },

  // Story Protocol
  [Chain.STORY_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 1516,
    name: 'Story',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.story.foundation',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.STORY_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 1513,
    name: 'Story Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.story.foundation',
    usdcAddress: '0x',
    isDev: true,
  },

  // Plume Network
  [Chain.PLUME_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 98865,
    name: 'Plume',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.plumenetwork.xyz',
    usdcAddress: '0x222365EF19F7947e5484218551B56bb3965Aa7aF',
    isDev: false,
  },
  [Chain.PLUME_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 98864,
    name: 'Plume Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.plumenetwork.xyz',
    usdcAddress: '0xcB5f30e335672893c7eb944B374c196392C19D18',
    isDev: true,
  },

  // Nexus
  [Chain.NEXUS_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 9999,
    name: 'Nexus',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.nexus.xyz',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.NEXUS_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 9998,
    name: 'Nexus Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.nexus.xyz',
    usdcAddress: '0x',
    isDev: true,
  },

  // HyperEVM
  [Chain.HYPEREVM_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 998,
    name: 'HyperEVM',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'app.hyperliquid.xyz/explorer',
    usdcAddress: '0xb88339CB7199b77E23DB6E890353E22632Ba630f',
    isDev: false,
  },
  [Chain.HYPEREVM_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 997,
    name: 'HyperEVM Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'app.hyperliquid-testnet.xyz/explorer',
    usdcAddress: '0x2B3370eE501B4a559b57D449569354196457D8Ab',
    isDev: true,
  },

  // Sonic
  [Chain.SONIC_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 146,
    name: 'Sonic',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'sonicscan.org',
    usdcAddress: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
    isDev: false,
  },
  [Chain.SONIC_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 64165,
    name: 'Sonic Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.sonicscan.org',
    usdcAddress: '0x0BA304580ee7c9a980CF72e55f5Ed2E9fd30Bc51',
    isDev: true,
  },
  [Chain.SONIC_BLAZE]: {
    chainType: ChainType.EVM,
    chainId: 57054,
    name: 'Sonic Blaze',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'blaze.sonicscan.org',
    usdcAddress: '0xA4879Fed32Ecbef99399e5cbC247E533421C4eC6',
    isDev: true,
  },

  // Unichain
  [Chain.UNICHAIN_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 1,
    name: 'Unichain',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'uniscan.xyz',
    usdcAddress: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
    isDev: false,
  },
  [Chain.UNICHAIN_SEPOLIA]: {
    chainType: ChainType.EVM,
    chainId: 1301,
    name: 'Unichain Sepolia',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'sepolia.uniscan.xyz',
    usdcAddress: '0x31d0220469e10c4E71834a79b1f276E153D00a2D',
    isDev: true,
  },

  // World Chain
  [Chain.WORLD_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 480,
    name: 'World Chain',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'worldscan.org',
    usdcAddress: '0x79A02482A880bCe3F13E09da970dC34dB4cD24D1',
    isDev: false,
  },

  // XDC Network
  [Chain.XDC_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 50,
    name: 'XDC Network',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'xdcscan.io',
    usdcAddress: '0x',
    isDev: false,
  },

  // Ink
  [Chain.INK_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 763373,
    name: 'Ink Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.inkonchain.com',
    usdcAddress: '0xFabab97dCE620294D2B0b0e46C68964e326300Ac',
    isDev: true,
  },

  // Fetch.ai
  [Chain.FETCH_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 2154,
    name: 'Fetch.ai',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explore.fetch.ai',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.FETCH_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 2153,
    name: 'Fetch.ai Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explore-testnet.fetch.ai',
    usdcAddress: '0x',
    isDev: true,
  },

  // Gensyn
  [Chain.GENSYN_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 8888,
    name: 'Gensyn',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.gensyn.ai',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.GENSYN_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 8887,
    name: 'Gensyn Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.gensyn.ai',
    usdcAddress: '0x',
    isDev: true,
  },

  // Ritual
  [Chain.RITUAL_MAINNET]: {
    chainType: ChainType.EVM,
    chainId: 7777,
    name: 'Ritual',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.ritual.net',
    usdcAddress: '0x',
    isDev: false,
  },
  [Chain.RITUAL_TESTNET]: {
    chainType: ChainType.EVM,
    chainId: 7776,
    name: 'Ritual Testnet',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: 'testnet.explorer.ritual.net',
    usdcAddress: '0x',
    isDev: true,
  },

  // Solana
  [Chain.SOLANA_MAINNET]: {
    chainType: ChainType.SOLANA,
    chainId: -101,
    name: 'Solana',
    alchemyNetwork: 'solana-mainnet',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.solana.com',
    usdcAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    isDev: false,
  },
  [Chain.SOLANA_DEVNET]: {
    chainType: ChainType.SOLANA,
    chainId: -102,
    name: 'Solana Devnet',
    alchemyNetwork: 'solana-devnet',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.solana.com/?cluster=devnet',
    usdcAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    isDev: true,
  },
  [Chain.SOLANA_TESTNET]: {
    chainType: ChainType.SOLANA,
    chainId: -103,
    name: 'Solana Testnet',
    alchemyNetwork: 'solana-testnet',
    explorerDomain: '',
    explorerBrowserDomain: 'explorer.solana.com/?cluster=testnet',
    usdcAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    isDev: true,
  },

  // Local development
  [Chain.EVM_LOCAL]: {
    chainType: ChainType.EVM,
    chainId: 31337,
    name: 'Local EVM',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: '',
    usdcAddress: '0x0000000000000000000000000000000000000000',
    isDev: true,
  },
  [Chain.SOLANA_LOCAL]: {
    chainType: ChainType.SOLANA,
    chainId: -104,
    name: 'Local Solana',
    alchemyNetwork: '',
    explorerDomain: '',
    explorerBrowserDomain: '',
    usdcAddress: '11111111111111111111111111111111',
    isDev: true,
  },
};

/**
 * Helper class for building RPC endpoints and block explorer API URLs
 */
export class RpcHelpers {
  /**
   * Check if a chain is an EVM chain
   * @param chain - Chain identifier to check
   * @returns True if the chain is an EVM chain
   */
  static isEvmChain(chain: Chain): boolean {
    const info = CHAIN_INFO_MAP[chain];
    return info ? info.chainType === ChainType.EVM : false;
  }

  /**
   * Check if a chain is a Solana chain
   * @param chain - Chain identifier to check
   * @returns True if the chain is a Solana chain
   */
  static isSolanaChain(chain: Chain): boolean {
    const info = CHAIN_INFO_MAP[chain];
    return info ? info.chainType === ChainType.SOLANA : false;
  }

  /**
   * Get the chain type (EVM or Solana) for a given chain
   * @param chain - Chain identifier
   * @returns ChainType.EVM or ChainType.SOLANA
   * @throws Error if the chain is not recognized
   * @example
   * ```typescript
   * const type = RpcHelpers.getChainType(Chain.ETH_MAINNET);
   * // Returns: ChainType.EVM
   *
   * const solanaType = RpcHelpers.getChainType(Chain.SOLANA_MAINNET);
   * // Returns: ChainType.SOLANA
   * ```
   */
  static getChainType(chain: Chain): ChainType {
    const info = CHAIN_INFO_MAP[chain];
    if (!info) {
      throw new Error(`Unknown chain: ${chain}`);
    }
    return info.chainType;
  }

  /**
   * Get complete static chain information
   * @param chain - Chain identifier
   * @returns ChainInfo object containing all static chain metadata
   * @throws Error if the chain is not recognized
   * @example
   * ```typescript
   * const info = RpcHelpers.getChainInfo(Chain.ETH_MAINNET);
   * // Returns: {
   * //   chainType: ChainType.EVM,
   * //   chainId: 1,
   * //   name: 'Ethereum',
   * //   alchemyNetwork: 'eth-mainnet',
   * //   explorerDomain: 'api.etherscan.io',
   * //   explorerBrowserDomain: 'etherscan.io',
   * //   usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
   * // }
   * ```
   */
  static getChainInfo(chain: Chain): ChainInfo {
    const info = CHAIN_INFO_MAP[chain];
    if (!info) {
      throw new Error(`Unknown chain: ${chain}`);
    }
    return info;
  }

  /**
   * Get the chain ID for a given chain
   * @param chain - Chain identifier
   * @returns Numeric chain ID for EVM chains, or negative ID for Solana chains
   * @throws Error if the chain is not recognized or has no chain ID
   * @example
   * ```typescript
   * const ethChainId = RpcHelpers.getChainId(Chain.ETH_MAINNET);
   * // Returns: 1
   *
   * const polygonChainId = RpcHelpers.getChainId(Chain.POLYGON_MAINNET);
   * // Returns: 137
   *
   * const solanaChainId = RpcHelpers.getChainId(Chain.SOLANA_MAINNET);
   * // Returns: -101
   *
   * const localChainId = RpcHelpers.getChainId(Chain.EVM_LOCAL);
   * // Returns: 31337
   * ```
   */
  static getChainId(chain: Chain): number {
    return this.getChainInfo(chain).chainId;
  }

  /**
   * Get the USDC address/mint for a given chain
   * @param chain - Chain identifier
   * @returns USDC contract address for EVM chains, or mint address for Solana chains
   * @throws Error if the chain is not recognized
   * @example
   * ```typescript
   * const ethUSDC = RpcHelpers.getUSDCAddress(Chain.ETH_MAINNET);
   * // Returns: '0xA0b86a33E6441146a8A8e27c01f0D9B1F5E42E92'
   *
   * const polygonUSDC = RpcHelpers.getUSDCAddress(Chain.POLYGON_MAINNET);
   * // Returns: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
   *
   * const solanaUSDC = RpcHelpers.getUSDCAddress(Chain.SOLANA_MAINNET);
   * // Returns: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
   * ```
   */
  static getUSDCAddress(chain: Chain): string {
    return this.getChainInfo(chain).usdcAddress;
  }

  /**
   * Get the user-friendly display name for a chain
   * @param chain - Chain identifier
   * @returns Human-readable chain name
   * @throws Error if the chain is not recognized
   * @example
   * ```typescript
   * const ethName = RpcHelpers.getUserFriendlyName(Chain.ETH_MAINNET);
   * // Returns: 'Ethereum'
   *
   * const polygonName = RpcHelpers.getUserFriendlyName(Chain.POLYGON_MAINNET);
   * // Returns: 'Polygon'
   *
   * const sepoliaName = RpcHelpers.getUserFriendlyName(Chain.ETH_SEPOLIA);
   * // Returns: 'Ethereum Sepolia'
   *
   * const localName = RpcHelpers.getUserFriendlyName(Chain.EVM_LOCAL);
   * // Returns: 'Local EVM'
   * ```
   */
  static getUserFriendlyName(chain: Chain): string {
    return this.getChainInfo(chain).name;
  }

  /**
   * Get the list of visible chains for the application
   * @param chainType - Filter by chain type (EVM or Solana)
   * @param isDev - Whether to include development/testnet chains (true) or production chains (false)
   * @returns Array of ChainInfo objects for chains that match the filters and have a mailer contract deployed
   * @example
   * ```typescript
   * // Get production EVM chains with mailer contracts
   * const prodEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, false);
   * // Returns: ChainInfo[] with only mainnet EVM chains that have mailerAddress set
   *
   * // Get development EVM chains with mailer contracts
   * const devEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, true);
   * // Returns: ChainInfo[] with only testnet EVM chains that have mailerAddress set
   *
   * // Get production Solana chains with mailer contracts
   * const prodSolanaChains = RpcHelpers.getVisibleChains(ChainType.SOLANA, false);
   * // Returns: ChainInfo[] with only mainnet Solana chains that have mailerAddress set
   * ```
   */
  static getVisibleChains(chainType: ChainType, isDev: boolean): ChainInfo[] {
    return Object.values(CHAIN_INFO_MAP).filter(
      (info) =>
        info.chainType === chainType &&
        info.isDev === isDev &&
        info.mailerAddress !== undefined
    );
  }

  /**
   * Derive all chain information from a ChainConfig including API URLs
   * @param config - Chain configuration with API keys
   * @returns Object with all derived chain information including RPC and explorer URLs
   * @example
   * ```typescript
   * const config: ChainConfig = {
   *   chain: Chain.ETH_MAINNET,
   *   alchemyApiKey: 'your-alchemy-key',
   *   etherscanApiKey: 'your-etherscan-key'
   * };
   *
   * const info = RpcHelpers.deriveChainInfo(config);
   * // Returns: {
   * //   chain: Chain.ETH_MAINNET,
   * //   chainId: 1,
   * //   chainType: ChainType.EVM,
   * //   name: 'Ethereum',
   * //   rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-alchemy-key',
   * //   explorerApiUrl: 'https://api.etherscan.io/api?apikey=your-etherscan-key',
   * //   explorerUrl: 'https://etherscan.io',
   * //   usdcAddress: '0xA0b86a33E6441146a8A8e27c01f0D9B1F5E42E92'
   * // }
   * ```
   */
  static deriveChainInfo(config: ChainConfig) {
    return {
      chain: config.chain,
      chainId: this.getChainId(config.chain),
      chainType: this.getChainType(config.chain),
      name: this.getUserFriendlyName(config.chain),
      rpcUrl: this.getRpcUrl(config.alchemyApiKey, config.chain),
      explorerApiUrl: this.getExplorerApiUrl(
        config.etherscanApiKey,
        config.chain
      ),
      explorerUrl: this.getBlockExplorerUrl(config.chain),
      usdcAddress: this.getUSDCAddress(config.chain),
    };
  }

  /**
   * Build Alchemy RPC URL for any supported chain
   *
   * @param alchemyApiKey - Your Alchemy API key
   * @param chain - Chain identifier from Chain enum
   * @returns Complete RPC URL, or undefined if API key is empty or chain is unsupported
   *
   * @example
   * ```typescript
   * const rpcUrl = RpcHelpers.getRpcUrl('your-api-key', Chain.ETH_MAINNET);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-api-key
   *
   * const solanaUrl = RpcHelpers.getRpcUrl('your-api-key', Chain.SOLANA_MAINNET);
   * // Returns: https://solana-mainnet.g.alchemy.com/v2/your-api-key
   *
   * const invalidUrl = RpcHelpers.getRpcUrl('', Chain.ETH_MAINNET);
   * // Returns: undefined
   * ```
   */
  static getRpcUrl(alchemyApiKey: string, chain: Chain): Optional<string>;
  /**
   * Get RPC URL using BlockchainApis configuration
   *
   * Convenience overload that uses the BlockchainApis structure.
   *
   * @param apis - Blockchain API keys configuration
   * @param chain - Chain identifier from Chain enum
   * @returns Complete RPC URL, or undefined if invalid
   *
   * @example
   * ```typescript
   * const apis = {
   *   alchemyApiKey: 'your-alchemy-key',
   *   etherscanApiKey: 'your-etherscan-key'
   * };
   *
   * const ethRpcUrl = RpcHelpers.getRpcUrl(apis, Chain.ETH_MAINNET);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-alchemy-key
   * ```
   */
  static getRpcUrl(apis: BlockchainApis, chain: Chain): Optional<string>;
  static getRpcUrl(
    apiKeyOrApis: string | BlockchainApis,
    chain: Chain
  ): Optional<string> {
    const alchemyApiKey =
      typeof apiKeyOrApis === 'string'
        ? apiKeyOrApis
        : apiKeyOrApis.alchemyApiKey;

    if (!alchemyApiKey) {
      return undefined;
    }

    const chainInfo = this.getChainInfo(chain);
    const network = chainInfo.alchemyNetwork;
    if (!network) {
      return undefined;
    }

    return `https://${network}.g.alchemy.com/v2/${alchemyApiKey}`;
  }

  /**
   * Get block explorer API URL
   *
   * Uses the Etherscan Multichain API key which works across 60+ EVM networks.
   * The API key is included as a query parameter in the URL.
   * Note: Solana chains don't have Etherscan-style API endpoints and will return undefined.
   *
   * @param etherscanApiKey - Your Etherscan Multichain API key (or BlockchainApis object)
   * @param chain - Chain identifier from Chain enum
   * @returns Complete API endpoint URL with API key, or undefined if API key is empty, chain is Solana, or no explorer API available
   *
   * @example
   * ```typescript
   * // With API key string
   * const etherscanUrl = RpcHelpers.getExplorerApiUrl('your-api-key', Chain.ETH_MAINNET);
   * // Returns: https://api.etherscan.io/api?apikey=your-api-key
   *
   * // With BlockchainApis object
   * const apis = {
   *   alchemyApiKey: 'your-alchemy-key',
   *   etherscanApiKey: 'your-etherscan-key'
   * };
   * const explorerApiUrl = RpcHelpers.getExplorerApiUrl(apis, Chain.POLYGON_MAINNET);
   * // Returns: https://api.polygonscan.com/api?apikey=your-etherscan-key
   *
   * const solanaUrl = RpcHelpers.getExplorerApiUrl('your-api-key', Chain.SOLANA_MAINNET);
   * // Returns: undefined (Solana doesn't have Etherscan-style API)
   * ```
   */
  static getExplorerApiUrl(
    etherscanApiKey: string,
    chain: Chain
  ): Optional<string>;
  static getExplorerApiUrl(
    apis: BlockchainApis,
    chain: Chain
  ): Optional<string>;
  static getExplorerApiUrl(
    apiKeyOrApis: string | BlockchainApis,
    chain: Chain
  ): Optional<string> {
    const etherscanApiKey =
      typeof apiKeyOrApis === 'string'
        ? apiKeyOrApis
        : apiKeyOrApis.etherscanApiKey;

    if (!etherscanApiKey) {
      return undefined;
    }

    const chainInfo = this.getChainInfo(chain);
    if (chainInfo.chainType === ChainType.SOLANA) {
      return undefined;
    }

    const domain = chainInfo.explorerDomain;
    if (!domain) {
      return undefined;
    }

    return `https://${domain}/api?apikey=${etherscanApiKey}`;
  }

  /**
   * Get block explorer browser URL
   *
   * @param chain - Chain identifier from Chain enum
   * @returns Browser URL for the explorer, or undefined if no explorer available
   *
   * @example
   * ```typescript
   * const etherscanUrl = RpcHelpers.getBlockExplorerUrl(Chain.ETH_MAINNET);
   * // Returns: https://etherscan.io
   *
   * const basescanUrl = RpcHelpers.getBlockExplorerUrl(Chain.BASE_MAINNET);
   * // Returns: https://basescan.org
   *
   * const solanaUrl = RpcHelpers.getBlockExplorerUrl(Chain.SOLANA_MAINNET);
   * // Returns: https://explorer.solana.com
   * ```
   */
  static getBlockExplorerUrl(chain: Chain): Optional<string> {
    const chainInfo = this.getChainInfo(chain);
    const domain = chainInfo.explorerBrowserDomain;
    if (!domain) {
      return undefined;
    }

    return `https://${domain}`;
  }
}
