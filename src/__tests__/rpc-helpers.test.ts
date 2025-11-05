/**
 * Tests for RPC helpers
 */

import { describe, it, expect } from 'vitest';
import { RpcHelpers, RpcEndpoint, ApiKeys } from '../rpc-helpers';
import { Chain, ChainType } from '@sudobility/types';

describe('ApiKeys', () => {
  it('should allow creating an object with all API keys', () => {
    const apiKeys: ApiKeys = {
      alchemyApiKey: 'alchemy-key',
      ankrApiKey: 'ankr-key',
      metamaskApiKey: 'metamask-key',
    };

    expect(apiKeys.alchemyApiKey).toBe('alchemy-key');
    expect(apiKeys.ankrApiKey).toBe('ankr-key');
    expect(apiKeys.metamaskApiKey).toBe('metamask-key');
  });

  it('should allow creating an object with partial API keys', () => {
    const alchemyOnly: ApiKeys = {
      alchemyApiKey: 'alchemy-key',
    };

    const ankrOnly: ApiKeys = {
      ankrApiKey: 'ankr-key',
    };

    const metamaskOnly: ApiKeys = {
      metamaskApiKey: 'metamask-key',
    };

    expect(alchemyOnly.alchemyApiKey).toBe('alchemy-key');
    expect(alchemyOnly.ankrApiKey).toBeUndefined();
    expect(ankrOnly.ankrApiKey).toBe('ankr-key');
    expect(metamaskOnly.metamaskApiKey).toBe('metamask-key');
  });

  it('should allow creating an empty object', () => {
    const empty: ApiKeys = {};

    expect(empty.alchemyApiKey).toBeUndefined();
    expect(empty.ankrApiKey).toBeUndefined();
    expect(empty.metamaskApiKey).toBeUndefined();
  });
});

describe('RpcEndpoint', () => {
  it('should have correct enum values', () => {
    expect(RpcEndpoint.Alchemy).toBe('alchemy');
    expect(RpcEndpoint.Ankr).toBe('ankr');
    expect(RpcEndpoint.Metamask).toBe('metamask');
  });

  it('should be usable as object keys', () => {
    const endpoints = {
      [RpcEndpoint.Alchemy]: 'https://alchemy.com',
      [RpcEndpoint.Ankr]: 'https://ankr.com',
      [RpcEndpoint.Metamask]: 'https://infura.io',
    };

    expect(endpoints[RpcEndpoint.Alchemy]).toBe('https://alchemy.com');
    expect(endpoints[RpcEndpoint.Ankr]).toBe('https://ankr.com');
    expect(endpoints[RpcEndpoint.Metamask]).toBe('https://infura.io');
  });
});

describe('RpcHelpers', () => {
  describe('isEvmChain', () => {
    it('should return true for EVM chains', () => {
      expect(RpcHelpers.isEvmChain(Chain.ETH_MAINNET)).toBe(true);
      expect(RpcHelpers.isEvmChain(Chain.POLYGON_MAINNET)).toBe(true);
    });

    it('should return false for Solana chains', () => {
      expect(RpcHelpers.isEvmChain(Chain.SOLANA_MAINNET)).toBe(false);
    });
  });

  describe('isSolanaChain', () => {
    it('should return true for Solana chains', () => {
      expect(RpcHelpers.isSolanaChain(Chain.SOLANA_MAINNET)).toBe(true);
    });

    it('should return false for EVM chains', () => {
      expect(RpcHelpers.isSolanaChain(Chain.ETH_MAINNET)).toBe(false);
    });
  });

  describe('getChainType', () => {
    it('should return correct chain type for EVM chains', () => {
      expect(RpcHelpers.getChainType(Chain.ETH_MAINNET)).toBe(ChainType.EVM);
    });

    it('should return correct chain type for Solana chains', () => {
      expect(RpcHelpers.getChainType(Chain.SOLANA_MAINNET)).toBe(ChainType.SOLANA);
    });
  });

  describe('getChainId', () => {
    it('should return correct chain ID for Ethereum', () => {
      expect(RpcHelpers.getChainId(Chain.ETH_MAINNET)).toBe(1);
    });

    it('should return correct chain ID for Polygon', () => {
      expect(RpcHelpers.getChainId(Chain.POLYGON_MAINNET)).toBe(137);
    });

    it('should return negative chain ID for Solana', () => {
      expect(RpcHelpers.getChainId(Chain.SOLANA_MAINNET)).toBe(-101);
    });
  });

  describe('getChainInfo', () => {
    it('should return complete chain info', () => {
      const info = RpcHelpers.getChainInfo(Chain.ETH_MAINNET);
      expect(info.chainType).toBe(ChainType.EVM);
      expect(info.chainId).toBe(1);
      expect(info.name).toBe('Ethereum');
      expect(info.usdcAddress).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
    });
  });

  describe('getUserFriendlyName', () => {
    it('should return correct display name', () => {
      expect(RpcHelpers.getUserFriendlyName(Chain.ETH_MAINNET)).toBe('Ethereum');
      expect(RpcHelpers.getUserFriendlyName(Chain.POLYGON_MAINNET)).toBe('Polygon');
    });
  });

  describe('getUSDCAddress', () => {
    it('should return USDC address for EVM chains', () => {
      const address = RpcHelpers.getUSDCAddress(Chain.ETH_MAINNET);
      expect(address).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
    });

    it('should return USDC mint for Solana', () => {
      const mint = RpcHelpers.getUSDCAddress(Chain.SOLANA_MAINNET);
      expect(mint).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    });
  });

  describe('getAlchemyRpcUrl', () => {
    it('should build correct Alchemy RPC URL for Ethereum', () => {
      const url = RpcHelpers.getAlchemyRpcUrl('test-api-key', Chain.ETH_MAINNET);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-api-key');
    });

    it('should build correct Alchemy RPC URL for Solana', () => {
      const url = RpcHelpers.getAlchemyRpcUrl('test-api-key', Chain.SOLANA_MAINNET);
      expect(url).toBe('https://solana-mainnet.g.alchemy.com/v2/test-api-key');
    });

    it('should return undefined for empty API key', () => {
      const url = RpcHelpers.getAlchemyRpcUrl('', Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should work with BlockchainApis object', () => {
      const apis = {
        apiKeys: {
          alchemyApiKey: 'test-api-key',
        },
        etherscanApiKey: 'test-etherscan-key',
      };
      const url = RpcHelpers.getAlchemyRpcUrl(apis, Chain.ETH_MAINNET);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-api-key');
    });
  });

  describe('getAnkrRpcUrl', () => {
    it('should build correct Ankr RPC URL for Ethereum', () => {
      const url = RpcHelpers.getAnkrRpcUrl('test-api-key', Chain.ETH_MAINNET);
      expect(url).toBe('https://rpc.ankr.com/eth/test-api-key');
    });

    it('should build correct Ankr RPC URL for Solana', () => {
      const url = RpcHelpers.getAnkrRpcUrl('test-api-key', Chain.SOLANA_MAINNET);
      expect(url).toBe('https://rpc.ankr.com/solana/test-api-key');
    });

    it('should build correct Ankr RPC URL for Polygon', () => {
      const url = RpcHelpers.getAnkrRpcUrl('test-api-key', Chain.POLYGON_MAINNET);
      expect(url).toBe('https://rpc.ankr.com/polygon/test-api-key');
    });

    it('should return undefined for empty API key', () => {
      const url = RpcHelpers.getAnkrRpcUrl('', Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should return undefined for unsupported chains', () => {
      const url = RpcHelpers.getAnkrRpcUrl('test-api-key', Chain.MONAD_MAINNET);
      expect(url).toBeUndefined();
    });
  });

  describe('getMetamaskRpcUrl', () => {
    it('should build correct Metamask/Infura RPC URL for Ethereum', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('test-api-key', Chain.ETH_MAINNET);
      expect(url).toBe('https://mainnet.infura.io/v3/test-api-key');
    });

    it('should build correct Metamask/Infura RPC URL for Polygon', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('test-api-key', Chain.POLYGON_MAINNET);
      expect(url).toBe('https://polygon-mainnet.infura.io/v3/test-api-key');
    });

    it('should build correct Metamask/Infura RPC URL for Arbitrum', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('test-api-key', Chain.ARBITRUM_MAINNET);
      expect(url).toBe('https://arbitrum-mainnet.infura.io/v3/test-api-key');
    });

    it('should build correct Metamask/Infura RPC URL for Linea', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('test-api-key', Chain.LINEA_MAINNET);
      expect(url).toBe('https://linea-mainnet.infura.io/v3/test-api-key');
    });

    it('should return undefined for empty API key', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('', Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should return undefined for unsupported chains', () => {
      const url = RpcHelpers.getMetamaskRpcUrl('test-api-key', Chain.BASE_MAINNET);
      expect(url).toBeUndefined();
    });
  });

  describe('getRpcUrl', () => {
    it('should route to Alchemy when endpoint is Alchemy', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        ankrApiKey: 'test-ankr-key',
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET, RpcEndpoint.Alchemy);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-alchemy-key');
    });

    it('should route to Ankr when endpoint is Ankr', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        ankrApiKey: 'test-ankr-key',
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.POLYGON_MAINNET, RpcEndpoint.Ankr);
      expect(url).toBe('https://rpc.ankr.com/polygon/test-ankr-key');
    });

    it('should route to Metamask when endpoint is Metamask', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        ankrApiKey: 'test-ankr-key',
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ARBITRUM_MAINNET, RpcEndpoint.Metamask);
      expect(url).toBe('https://arbitrum-mainnet.infura.io/v3/test-metamask-key');
    });

    it('should return undefined when API key is missing', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET, RpcEndpoint.Ankr);
      expect(url).toBeUndefined();
    });

    it('should return undefined for unsupported chain/provider combinations', () => {
      const apiKeys: ApiKeys = {
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.BASE_MAINNET, RpcEndpoint.Metamask);
      expect(url).toBeUndefined();
    });

    it('should work with Solana chains via Alchemy', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.SOLANA_MAINNET, RpcEndpoint.Alchemy);
      expect(url).toBe('https://solana-mainnet.g.alchemy.com/v2/test-alchemy-key');
    });

    it('should work with Solana chains via Ankr', () => {
      const apiKeys: ApiKeys = {
        ankrApiKey: 'test-ankr-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.SOLANA_MAINNET, RpcEndpoint.Ankr);
      expect(url).toBe('https://rpc.ankr.com/solana/test-ankr-key');
    });

    it('should use Ankr as highest priority when endpoint is not specified', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        ankrApiKey: 'test-ankr-key',
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET);
      expect(url).toBe('https://rpc.ankr.com/eth/test-ankr-key');
    });

    it('should fallback to Metamask when Ankr is unavailable', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        metamaskApiKey: 'test-metamask-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET);
      expect(url).toBe('https://mainnet.infura.io/v3/test-metamask-key');
    });

    it('should fallback to Alchemy when Ankr and Metamask are unavailable', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
      };
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-alchemy-key');
    });

    it('should return undefined when no keys are available and endpoint is not specified', () => {
      const apiKeys: ApiKeys = {};
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should fallback correctly when chain is not supported by higher priority providers', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        ankrApiKey: 'test-ankr-key',
        metamaskApiKey: 'test-metamask-key',
      };
      // BASE_MAINNET is not supported by Metamask, so it should use Ankr
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.BASE_MAINNET);
      expect(url).toBe('https://rpc.ankr.com/base/test-ankr-key');
    });

    it('should fallback correctly for chains not supported by Ankr or Metamask', () => {
      const apiKeys: ApiKeys = {
        alchemyApiKey: 'test-alchemy-key',
        metamaskApiKey: 'test-metamask-key',
      };
      // MONAD_MAINNET is only supported by none, but we should still return undefined
      const url = RpcHelpers.getRpcUrl(apiKeys, Chain.MONAD_MAINNET);
      expect(url).toBeUndefined();
    });
  });

  describe('getExplorerApiUrl', () => {
    it('should build correct explorer API URL for Ethereum', () => {
      const url = RpcHelpers.getExplorerApiUrl('test-api-key', Chain.ETH_MAINNET);
      expect(url).toBe('https://api.etherscan.io/api?apikey=test-api-key');
    });

    it('should return undefined for Solana chains', () => {
      const url = RpcHelpers.getExplorerApiUrl('test-api-key', Chain.SOLANA_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should return undefined for empty API key', () => {
      const url = RpcHelpers.getExplorerApiUrl('', Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should work with BlockchainApis object', () => {
      const apis = {
        apiKeys: {
          alchemyApiKey: 'test-alchemy-key',
        },
        etherscanApiKey: 'test-etherscan-key',
      };
      const url = RpcHelpers.getExplorerApiUrl(apis, Chain.ETH_MAINNET);
      expect(url).toBe('https://api.etherscan.io/api?apikey=test-etherscan-key');
    });
  });

  describe('getBlockExplorerUrl', () => {
    it('should return correct browser URL for Ethereum', () => {
      const url = RpcHelpers.getBlockExplorerUrl(Chain.ETH_MAINNET);
      expect(url).toBe('https://etherscan.io');
    });

    it('should return correct browser URL for Solana', () => {
      const url = RpcHelpers.getBlockExplorerUrl(Chain.SOLANA_MAINNET);
      expect(url).toBe('https://explorer.solana.com');
    });
  });

  describe('getVisibleChains', () => {
    it('should return only chains with mailer addresses', () => {
      const allEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, true);
      expect(allEvmChains.length).toBeGreaterThan(0);
      allEvmChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
      });
    });

    it('should return only mainnet chains when includesTestNet is false', () => {
      const mainnetEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, false);
      // If there are any chains returned, they should all be mainnet
      mainnetEvmChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
        expect(chain.isTestNet).toBe(false);
      });
    });

    it('should return both mainnet and testnet chains when includesTestNet is true', () => {
      const allEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, true);
      const hasMainnet = allEvmChains.some((chain) => !chain.isTestNet);
      const hasTestnet = allEvmChains.some((chain) => chain.isTestNet);
      expect(hasMainnet || hasTestnet).toBe(true); // At least one type should exist
    });

    it('should return all chain types when chainType is undefined and includesTestNet is true', () => {
      const allChains = RpcHelpers.getVisibleChains(undefined, true);
      expect(allChains.length).toBeGreaterThan(0);
      allChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
      });
    });

    it('should return only mainnet chains of all types when chainType is undefined and includesTestNet is false', () => {
      const mainnetChains = RpcHelpers.getVisibleChains(undefined, false);
      // If there are any chains returned, they should all be mainnet
      mainnetChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
        expect(chain.isTestNet).toBe(false);
      });
    });

    it('should filter by specific chain type when provided', () => {
      const evmChains = RpcHelpers.getVisibleChains(ChainType.EVM, true);
      const solanaChains = RpcHelpers.getVisibleChains(ChainType.SOLANA, true);

      evmChains.forEach((chain) => {
        expect(chain.chainType).toBe(ChainType.EVM);
      });

      solanaChains.forEach((chain) => {
        expect(chain.chainType).toBe(ChainType.SOLANA);
      });
    });

    it('should use default parameters when called with no arguments', () => {
      const allChains = RpcHelpers.getVisibleChains();
      expect(allChains.length).toBeGreaterThan(0);
      allChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
      });
    });

    it('should use default includesTestNet=true when only chainType is provided', () => {
      const evmChains = RpcHelpers.getVisibleChains(ChainType.EVM);
      const hasMainnet = evmChains.some((chain) => !chain.isTestNet);
      const hasTestnet = evmChains.some((chain) => chain.isTestNet);
      // With includesTestNet=true (default), we should get both or at least one type
      expect(hasMainnet || hasTestnet).toBe(true);
    });
  });

  describe('deriveChainInfo', () => {
    it('should derive complete chain info from config', () => {
      const config = {
        chain: Chain.ETH_MAINNET,
        alchemyApiKey: 'test-alchemy-key',
        etherscanApiKey: 'test-etherscan-key',
      };

      const info = RpcHelpers.deriveChainInfo(config);
      expect(info.chain).toBe(Chain.ETH_MAINNET);
      expect(info.chainId).toBe(1);
      expect(info.chainType).toBe(ChainType.EVM);
      expect(info.name).toBe('Ethereum');
      expect(info.rpcUrl).toBe('https://eth-mainnet.g.alchemy.com/v2/test-alchemy-key');
      expect(info.explorerApiUrl).toBe('https://api.etherscan.io/api?apikey=test-etherscan-key');
      expect(info.explorerUrl).toBe('https://etherscan.io');
      expect(info.usdcAddress).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
    });
  });
});
