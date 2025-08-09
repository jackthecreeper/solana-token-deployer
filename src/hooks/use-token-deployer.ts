'use client';

import { useState, useCallback } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { TokenDeployer, TokenDeployParams } from '@/lib/solana/token-deployer';
import { MetadataUploader, TokenMetadataUpload } from '@/lib/solana/metadata-uploader';
import { TokenValidator, ValidationError } from '@/lib/solana/validation';

export interface DeployState {
  isDeploying: boolean;
  progress: number;
  step: string;
  errors: ValidationError[];
  mintAddress?: string;
  transactionSignature?: string;
  metadataUri?: string;
}

export interface DeployTokenWithMetadata extends TokenDeployParams {
  metadata: TokenMetadataUpload;
}

export function useTokenDeployer() {
  const [deployState, setDeployState] = useState<DeployState>({
    isDeploying: false,
    progress: 0,
    step: '',
    errors: [],
  });

  const resetState = useCallback(() => {
    setDeployState({
      isDeploying: false,
      progress: 0,
      step: '',
      errors: [],
    });
  }, []);

  const deployToken = useCallback(async (
    params: DeployTokenWithMetadata,
    payer: Keypair
  ) => {
    try {
      resetState();
      
      setDeployState(prev => ({
        ...prev,
        isDeploying: true,
        step: 'Validating parameters...',
        progress: 10,
      }));

      // Validate parameters
      const validationErrors = [
        ...TokenValidator.validateTokenParams(params),
        ...TokenValidator.validateMetadata(params.metadata),
      ];

      if (validationErrors.length > 0) {
        setDeployState(prev => ({
          ...prev,
          isDeploying: false,
          errors: validationErrors,
          progress: 0,
        }));
        return;
      }

      setDeployState(prev => ({
        ...prev,
        step: 'Uploading metadata...',
        progress: 20,
      }));

      // Upload metadata
      const metadataUploader = new MetadataUploader();
      const metadataUri = await metadataUploader.uploadMetadata(params.metadata);

      setDeployState(prev => ({
        ...prev,
        step: 'Deploying token...',
        progress: 40,
      }));

      // Deploy token
      const tokenDeployer = new TokenDeployer();
      const result = await tokenDeployer.deployToken(params, payer);

      setDeployState(prev => ({
        ...prev,
        step: 'Creating metadata account...',
        progress: 80,
      }));

      // Create metadata account
      await metadataUploader.createMetadataAccount(
        new PublicKey(result.mintAddress),
        params.metadata,
        payer
      );

      setDeployState(prev => ({
        ...prev,
        step: 'Complete!',
        progress: 100,
        mintAddress: result.mintAddress,
        transactionSignature: result.transactionSignature,
        metadataUri,
        isDeploying: false,
      }));

    } catch (error) {
      console.error('Error deploying token:', error);
      setDeployState(prev => ({
        ...prev,
        isDeploying: false,
        errors: [{ field: 'general', message: error instanceof Error ? error.message : 'Unknown error occurred' }],
      }));
    }
  }, [resetState]);

  return {
    deployState,
    deployToken,
    resetState,
  };
}
