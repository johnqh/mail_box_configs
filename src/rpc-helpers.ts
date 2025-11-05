/**
 * RPC and API endpoint helper utilities
 *
 * Provides helper functions to build RPC endpoints and block explorer API URLs
 * from API keys and chain identifiers.
 */

import { Chain, ChainType } from '@sudobility/types';
import { Optional } from '@sudobility/types';
import type { ChainConfig } from '@sudobility/types';
import { CHAIN_INFO_MAP } from './chain-info-map';

/**
 * Blockchain API keys configuration
 */
export interface BlockchainApis {
  /** RPC provider API keys (Alchemy, Ankr, Metamask) */
  apiKeys: ApiKeys;
  /** Etherscan Multichain API key for block explorer API access (EVM only) */
  etherscanApiKey: string;
}

/**
 * RPC endpoint providers
 */
export enum RpcEndpoint {
  /** Alchemy RPC endpoint */
  Alchemy = 'alchemy',
  /** Ankr RPC endpoint */
  Ankr = 'ankr',
  /** Metamask/Infura RPC endpoint */
  Metamask = 'metamask',
}

/**
 * RPC provider API keys configuration
 */
export interface ApiKeys {
  /** Alchemy API key for RPC access (supports both EVM and Solana) */
  alchemyApiKey?: string;
  /** Ankr API key for RPC access (supports both EVM and Solana) */
  ankrApiKey?: string;
  /** Metamask/Infura API key for RPC access (EVM only) */
  metamaskApiKey?: string;
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
  /** Alchemy network identifier for RPC endpoints (undefined if unsupported) */
  alchemyNetwork: Optional<string>;
  /** Ankr network identifier for RPC endpoints (undefined if unsupported) */
  ankrNetwork: Optional<string>;
  /** Metamask/Infura network identifier for RPC endpoints (undefined if unsupported) */
  metamaskNetwork: Optional<string>;
  /** Block explorer API domain (undefined for Solana and unsupported chains) */
  explorerDomain: Optional<string>;
  /** Block explorer browser domain (undefined for unsupported chains) */
  explorerBrowserDomain: Optional<string>;
  /** USDC contract address (EVM) or mint address (Solana) (undefined if not available) */
  usdcAddress: Optional<string>;
  /** Whether this is a development/testnet chain (true) or mainnet/production chain (false) */
  isTestNet: boolean;
  /** Optional deployed mailer contract address (EVM chains only) */
  mailerAddress?: string;
  /** Optional block number where the mailer contract was deployed (used for event indexing) */
  startingBlock?: number;
}

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
   * @returns USDC contract address for EVM chains, or mint address for Solana chains, or undefined if not available
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
  static getUSDCAddress(chain: Chain): Optional<string> {
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
   * @param chainType - Optional filter by chain type (EVM or Solana). Defaults to undefined (all types).
   * @param includesTestNet - If true, include both mainnet and testnet chains. If false, only include mainnet chains (isTestNet = false). Defaults to true.
   * @returns Array of ChainInfo objects for chains that match the filters and have a mailer contract deployed
   * @example
   * ```typescript
   * // Get all chains (all types, both mainnet and testnet) with mailer contracts - using defaults
   * const allChains = RpcHelpers.getVisibleChains();
   * // Returns: ChainInfo[] with all chains that have mailerAddress set
   *
   * // Get only mainnet EVM chains with mailer contracts
   * const prodEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, false);
   * // Returns: ChainInfo[] with only mainnet EVM chains that have mailerAddress set
   *
   * // Get all EVM chains (both mainnet and testnet) with mailer contracts
   * const allEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM);
   * // Returns: ChainInfo[] with both mainnet and testnet EVM chains that have mailerAddress set
   *
   * // Get only mainnet Solana chains with mailer contracts
   * const prodSolanaChains = RpcHelpers.getVisibleChains(ChainType.SOLANA, false);
   * // Returns: ChainInfo[] with only mainnet Solana chains that have mailerAddress set
   *
   * // Get all mainnet chains (both EVM and Solana) with mailer contracts
   * const allMainnetChains = RpcHelpers.getVisibleChains(undefined, false);
   * // Returns: ChainInfo[] with only mainnet chains (all types) that have mailerAddress set
   * ```
   */
  static getVisibleChains(chainType?: ChainType, includesTestNet: boolean = true): ChainInfo[] {
    return Object.values(CHAIN_INFO_MAP).filter(
      (info) =>
        (chainType === undefined || info.chainType === chainType) &&
        (includesTestNet || !info.isTestNet) &&
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
      rpcUrl: this.getAlchemyRpcUrl(config.alchemyApiKey, config.chain),
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
   * const rpcUrl = RpcHelpers.getAlchemyRpcUrl('your-api-key', Chain.ETH_MAINNET);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-api-key
   *
   * const solanaUrl = RpcHelpers.getAlchemyRpcUrl('your-api-key', Chain.SOLANA_MAINNET);
   * // Returns: https://solana-mainnet.g.alchemy.com/v2/your-api-key
   *
   * const invalidUrl = RpcHelpers.getAlchemyRpcUrl('', Chain.ETH_MAINNET);
   * // Returns: undefined
   * ```
   */
  static getAlchemyRpcUrl(alchemyApiKey: string, chain: Chain): Optional<string>;
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
   * const ethRpcUrl = RpcHelpers.getAlchemyRpcUrl(apis, Chain.ETH_MAINNET);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-alchemy-key
   * ```
   */
  static getAlchemyRpcUrl(apis: BlockchainApis, chain: Chain): Optional<string>;
  static getAlchemyRpcUrl(
    apiKeyOrApis: string | BlockchainApis,
    chain: Chain
  ): Optional<string> {
    const alchemyApiKey =
      typeof apiKeyOrApis === 'string'
        ? apiKeyOrApis
        : apiKeyOrApis.apiKeys.alchemyApiKey;

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
   * Build Ankr RPC URL for any supported chain
   *
   * @param ankrApiKey - Your Ankr API key
   * @param chain - Chain identifier from Chain enum
   * @returns Complete RPC URL, or undefined if API key is empty or chain is unsupported
   *
   * @example
   * ```typescript
   * const rpcUrl = RpcHelpers.getAnkrRpcUrl('your-api-key', Chain.ETH_MAINNET);
   * // Returns: https://rpc.ankr.com/eth/your-api-key
   *
   * const solanaUrl = RpcHelpers.getAnkrRpcUrl('your-api-key', Chain.SOLANA_MAINNET);
   * // Returns: https://rpc.ankr.com/solana/your-api-key
   *
   * const invalidUrl = RpcHelpers.getAnkrRpcUrl('', Chain.ETH_MAINNET);
   * // Returns: undefined
   * ```
   */
  static getAnkrRpcUrl(ankrApiKey: string, chain: Chain): Optional<string> {
    if (!ankrApiKey) {
      return undefined;
    }

    const chainInfo = this.getChainInfo(chain);
    const network = chainInfo.ankrNetwork;
    if (!network) {
      return undefined;
    }

    return `https://rpc.ankr.com/${network}/${ankrApiKey}`;
  }

  /**
   * Build Metamask/Infura RPC URL for any supported chain
   *
   * @param metamaskApiKey - Your Infura/Metamask API key
   * @param chain - Chain identifier from Chain enum
   * @returns Complete RPC URL, or undefined if API key is empty or chain is unsupported
   *
   * @example
   * ```typescript
   * const rpcUrl = RpcHelpers.getMetamaskRpcUrl('your-api-key', Chain.ETH_MAINNET);
   * // Returns: https://mainnet.infura.io/v3/your-api-key
   *
   * const polygonUrl = RpcHelpers.getMetamaskRpcUrl('your-api-key', Chain.POLYGON_MAINNET);
   * // Returns: https://polygon-mainnet.infura.io/v3/your-api-key
   *
   * const invalidUrl = RpcHelpers.getMetamaskRpcUrl('', Chain.ETH_MAINNET);
   * // Returns: undefined
   * ```
   */
  static getMetamaskRpcUrl(metamaskApiKey: string, chain: Chain): Optional<string> {
    if (!metamaskApiKey) {
      return undefined;
    }

    const chainInfo = this.getChainInfo(chain);
    const network = chainInfo.metamaskNetwork;
    if (!network) {
      return undefined;
    }

    return `https://${network}.infura.io/v3/${metamaskApiKey}`;
  }

  /**
   * Build RPC URL for any supported chain using the specified RPC provider
   *
   * This is a convenience method that routes to the appropriate provider-specific
   * function based on the endpoint parameter. If no endpoint is specified, it will
   * try providers in priority order (Ankr > Metamask > Alchemy) and return the
   * first available URL.
   *
   * @param apiKeys - API keys for all RPC providers
   * @param chain - Chain identifier from Chain enum
   * @param endpoint - Optional RPC endpoint provider to use (Alchemy, Ankr, or Metamask). If not specified, uses priority order: Ankr > Metamask > Alchemy
   * @returns Complete RPC URL, or undefined if no API keys are available or chain is unsupported by all providers
   *
   * @example
   * ```typescript
   * const apiKeys: ApiKeys = {
   *   alchemyApiKey: 'your-alchemy-key',
   *   ankrApiKey: 'your-ankr-key',
   *   metamaskApiKey: 'your-metamask-key'
   * };
   *
   * // With specific endpoint
   * const alchemyUrl = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET, RpcEndpoint.Alchemy);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-alchemy-key
   *
   * const ankrUrl = RpcHelpers.getRpcUrl(apiKeys, Chain.POLYGON_MAINNET, RpcEndpoint.Ankr);
   * // Returns: https://rpc.ankr.com/polygon/your-ankr-key
   *
   * const metamaskUrl = RpcHelpers.getRpcUrl(apiKeys, Chain.ARBITRUM_MAINNET, RpcEndpoint.Metamask);
   * // Returns: https://arbitrum-mainnet.infura.io/v3/your-metamask-key
   *
   * // Without endpoint - uses priority order
   * const autoUrl = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET);
   * // Returns: https://rpc.ankr.com/eth/your-ankr-key (Ankr has highest priority)
   *
   * const partialKeys: ApiKeys = {
   *   alchemyApiKey: 'your-alchemy-key'
   * };
   * const fallbackUrl = RpcHelpers.getRpcUrl(partialKeys, Chain.ETH_MAINNET);
   * // Returns: https://eth-mainnet.g.alchemy.com/v2/your-alchemy-key (falls back to Alchemy)
   * ```
   */
  static getRpcUrl(
    apiKeys: ApiKeys,
    chain: Chain,
    endpoint?: RpcEndpoint
  ): Optional<string> {
    // If endpoint is specified, use that specific provider
    if (endpoint !== undefined) {
      switch (endpoint) {
        case RpcEndpoint.Alchemy:
          return this.getAlchemyRpcUrl(apiKeys.alchemyApiKey ?? '', chain);
        case RpcEndpoint.Ankr:
          return this.getAnkrRpcUrl(apiKeys.ankrApiKey ?? '', chain);
        case RpcEndpoint.Metamask:
          return this.getMetamaskRpcUrl(apiKeys.metamaskApiKey ?? '', chain);
        default:
          return undefined;
      }
    }

    // If no endpoint specified, try providers in priority order: Ankr > Metamask > Alchemy
    const ankrUrl = this.getAnkrRpcUrl(apiKeys.ankrApiKey ?? '', chain);
    if (ankrUrl) {
      return ankrUrl;
    }

    const metamaskUrl = this.getMetamaskRpcUrl(apiKeys.metamaskApiKey ?? '', chain);
    if (metamaskUrl) {
      return metamaskUrl;
    }

    const alchemyUrl = this.getAlchemyRpcUrl(apiKeys.alchemyApiKey ?? '', chain);
    if (alchemyUrl) {
      return alchemyUrl;
    }

    return undefined;
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
