export const SOLANA_CONFIG = {
  networks: {
    mainnet: {
      name: 'Mainnet Beta',
      endpoint: 'https://api.mainnet-beta.solana.com',
      chainId: 101,
    },
    devnet: {
      name: 'Devnet',
      endpoint: 'https://api.devnet.solana.com',
      chainId: 103,
    },
    testnet: {
      name: 'Testnet',
      endpoint: 'https://api.testnet.solana.com',
      chainId: 102,
    },
  },
  defaultNetwork: 'mainnet',
  commitment: 'confirmed',
  preflightCommitment: 'confirmed',
} as const;

export type Network = keyof typeof SOLANA_CONFIG.networks;
