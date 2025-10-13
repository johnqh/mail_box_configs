/**
 * Tests for RPC helpers
 */

import { describe, it, expect } from 'vitest';
import { RpcHelpers } from '../rpc-helpers';
import { Chain, ChainType } from '@sudobility/types';

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

  describe('getRpcUrl', () => {
    it('should build correct Alchemy RPC URL for Ethereum', () => {
      const url = RpcHelpers.getRpcUrl('test-api-key', Chain.ETH_MAINNET);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-api-key');
    });

    it('should build correct Alchemy RPC URL for Solana', () => {
      const url = RpcHelpers.getRpcUrl('test-api-key', Chain.SOLANA_MAINNET);
      expect(url).toBe('https://solana-mainnet.g.alchemy.com/v2/test-api-key');
    });

    it('should return undefined for empty API key', () => {
      const url = RpcHelpers.getRpcUrl('', Chain.ETH_MAINNET);
      expect(url).toBeUndefined();
    });

    it('should work with BlockchainApis object', () => {
      const apis = {
        alchemyApiKey: 'test-api-key',
        etherscanApiKey: 'test-etherscan-key',
      };
      const url = RpcHelpers.getRpcUrl(apis, Chain.ETH_MAINNET);
      expect(url).toBe('https://eth-mainnet.g.alchemy.com/v2/test-api-key');
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
        alchemyApiKey: 'test-alchemy-key',
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
      const devEvmChains = RpcHelpers.getVisibleChains(ChainType.EVM, true);
      expect(devEvmChains.length).toBeGreaterThan(0);
      devEvmChains.forEach((chain) => {
        expect(chain.mailerAddress).toBeDefined();
        expect(chain.isDev).toBe(true);
      });
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
