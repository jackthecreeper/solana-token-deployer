import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from './config';

export class SolanaConnectionManager {
  private connection: Connection;
  private network: string;

  constructor(network: string = SOLANA_CONFIG.defaultNetwork) {
    this.network = network;
    this.connection = new Connection(
      SOLANA_CONFIG.networks[network as keyof typeof SOLANA_CONFIG.networks].endpoint,
      SOLANA_CONFIG.commitment
    );
  }

  getConnection(): Connection {
    return this.connection;
  }

  setNetwork(network: string): void {
    this.network = network;
    this.connection = new Connection(
      SOLANA_CONFIG.networks[network as keyof typeof SOLANA_CONFIG.networks].endpoint,
      SOLANA_CONFIG.commitment
    );
  }

  getNetwork(): string {
    return this.network;
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.connection.getEpochInfo();
      return true;
    } catch {
      return false;
    }
  }
}

