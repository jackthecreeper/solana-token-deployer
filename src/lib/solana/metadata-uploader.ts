import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from './config';

export interface TokenMetadataUpload {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  attributes?: Array<{trait_type: string; value: string}>;
  external_url?: string;
}

export class MetadataUploader {
  private connection: Connection;

  constructor(
    network: string = SOLANA_CONFIG.defaultNetwork
  ) {
    this.connection = new Connection(
      SOLANA_CONFIG.networks[network as keyof typeof SOLANA_CONFIG.networks].endpoint,
      SOLANA_CONFIG.commitment
    );
  }

  async uploadMetadata(metadata: TokenMetadataUpload): Promise<string> {
    try {
      // Create metadata JSON structure
      const metadataJson = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description || '',
        image: metadata.image || '',
        attributes: metadata.attributes || [],
        external_url: metadata.external_url || '',
        properties: {
          files: metadata.image ? [{ uri: metadata.image, type: "image/png" }] : [],
          category: "image",
          creators: []
        }
      };
      
      // For production, integrate with Pinata or Arweave
      // This is a simplified implementation
      const metadataString = JSON.stringify(metadataJson, null, 2);
      
      // In a real implementation, upload to IPFS/Arweave
      // For now, return a data URI
      const dataUri = `data:application/json;base64,${Buffer.from(metadataString).toString('base64')}`;
      
      return dataUri;
    } catch (error) {
      console.error('Error uploading metadata:', error);
      throw error;
    }
  }

  async createMetadataAccount(
    mintAddress: PublicKey,
    metadata: TokenMetadataUpload,
    payer: any
  ): Promise<string> {
    try {
      console.log('Creating metadata for mint:', mintAddress.toString());
      const metadataUri = await this.uploadMetadata(metadata);
      return metadataUri;
    } catch (error) {
      console.error('Error creating metadata account:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      // For production, integrate with Pinata
      // This is a simplified implementation
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}
