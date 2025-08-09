import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  mintTo,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from '@solana/spl-token';
import { SolanaConnectionManager } from './connection';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
}

export interface TokenDeployParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  metadata?: TokenMetadata;
  mintAuthority?: PublicKey;
  freezeAuthority?: PublicKey;
}

export class TokenDeployer {
  private connection: Connection;

  constructor() {
    const connectionManager = new SolanaConnectionManager();
    this.connection = connectionManager.getConnection();
  }

  async deployToken(params: TokenDeployParams, payer: Keypair): Promise<{
    mintAddress: string;
    transactionSignature: string;
  }> {
    try {
      // Create new mint keypair
      const mintKeypair = Keypair.generate();
      const mintPublicKey = mintKeypair.publicKey;

      // Calculate rent exemption for mint account
      const mintRent = await this.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      // Create transaction
      const transaction = new Transaction().add(
        // Create mint account
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintPublicKey,
          space: MINT_SIZE,
          lamports: mintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
        // Initialize mint
        createInitializeMintInstruction(
          mintPublicKey,
          params.decimals,
          params.mintAuthority || payer.publicKey,
          params.freezeAuthority || payer.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      // Add priority fee
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 10000,
        })
      );

      // Send transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer, mintKeypair],
        { commitment: 'confirmed' }
      );

      // Mint initial supply if specified
      if (params.initialSupply > 0) {
        await this.mintInitialSupply(
          mintPublicKey,
          params.initialSupply,
          params.decimals,
          payer
        );
      }

      return {
        mintAddress: mintPublicKey.toString(),
        transactionSignature: signature,
      };
    } catch (error) {
      console.error('Error deploying token:', error);
      throw error;
    }
  }

  async mintInitialSupply(
    mintPublicKey: PublicKey,
    initialSupply: number,
    decimals: number,
    payer: Keypair
  ): Promise<void> {
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        payer.publicKey,
        false
      );

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payer.publicKey,
          associatedTokenAddress,
          payer.publicKey,
          mintPublicKey
        ),
        mintTo(
          mintPublicKey,
          associatedTokenAddress,
          payer.publicKey,
          initialSupply * Math.pow(10, decimals)
        )
      );

      await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer],
        { commitment: 'confirmed' }
      );
    } catch (error) {
      console.error('Error minting initial supply:', error);
      throw error;
    }
  }

  async getTokenInfo(mintAddress: string): Promise<{
    mintAuthority: string | null;
    freezeAuthority: string | null;
    decimals: number;
    supply: string;
  }> {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
      
      if (!mintInfo.value) {
        throw new Error('Token not found');
      }

      const data = mintInfo.value.data as any;
      return {
        mintAuthority: data.parsed.info.mintAuthority?.toString() || null,
        freezeAuthority: data.parsed.info.freezeAuthority?.toString() || null,
        decimals: data.parsed.info.decimals,
        supply: data.parsed.info.supply,
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }
}

export const tokenDeployer = new TokenDeployer();
