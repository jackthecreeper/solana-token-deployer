import { TokenDeployParams } from './token-deployer';

export interface ValidationError {
  field: string;
  message: string;
}

export class TokenValidator {
  static validateTokenParams(params: TokenDeployParams): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate name
    if (!params.name || params.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Token name is required' });
    } else if (params.name.length > 32) {
      errors.push({ field: 'name', message: 'Token name must be 32 characters or less' });
    }

    // Validate symbol
    if (!params.symbol || params.symbol.trim().length === 0) {
      errors.push({ field: 'symbol', message: 'Token symbol is required' });
    } else if (params.symbol.length > 10) {
      errors.push({ field: 'symbol', message: 'Token symbol must be 10 characters or less' });
    } else if (!/^[A-Z0-9]+$/.test(params.symbol)) {
      errors.push({ field: 'symbol', message: 'Token symbol must contain only uppercase letters and numbers' });
    }

    // Validate decimals
    if (params.decimals < 0 || params.decimals > 9) {
      errors.push({ field: 'decimals', message: 'Decimals must be between 0 and 9' });
    }

    // Validate initial supply
    if (params.initialSupply < 0) {
      errors.push({ field: 'initialSupply', message: 'Initial supply must be positive' });
    } else if (params.initialSupply > 1000000000000) {
      errors.push({ field: 'initialSupply', message: 'Initial supply is too large' });
    }

    return errors;
  }

  static validateMetadata(metadata: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (metadata.description && metadata.description.length > 500) {
      errors.push({ field: 'description', message: 'Description must be 500 characters or less' });
    }

    if (metadata.image && !this.isValidUrl(metadata.image)) {
      errors.push({ field: 'image', message: 'Please provide a valid image URL' });
    }

    if (metadata.external_url && !this.isValidUrl(metadata.external_url)) {
      errors.push({ field: 'external_url', message: 'Please provide a valid external URL' });
    }

    return errors;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
