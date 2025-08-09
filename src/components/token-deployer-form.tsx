'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { useTokenDeployer } from '@/hooks/use-token-deployer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FormData {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  description: string;
  image: string;
  external_url: string;
}

export function TokenDeployerForm() {
  const { publicKey } = useWallet();
  const { deployState, deployToken } = useTokenDeployer();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    decimals: 6,
    initialSupply: 1000000,
    description: '',
    image: '',
    external_url: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'decimals' || name === 'initialSupply' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const keypair = Keypair.generate();
      
      await deployToken({
        name: formData.name,
        symbol: formData.symbol,
        decimals: formData.decimals,
        initialSupply: formData.initialSupply,
        metadata: {
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          image: formData.image,
          external_url: formData.external_url,
        }
      }, keypair);

      toast.success('Token deployed successfully!');
    } catch (error) {
      toast.error('Failed to deploy token');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Deploy New Token</CardTitle>
          <CardDescription>Create and deploy a new SPL token on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Token Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Token"
                required
              />
            </div>

            <div>
              <Label htmlFor="symbol">Token Symbol *</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="TOKEN"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="decimals">Decimals *</Label>
                <Input
                  id="decimals"
                  name="decimals"
                  type="number"
                  min="0"
                  max="9"
                  value={formData.decimals}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="initialSupply">Initial Supply *</Label>
                <Input
                  id="initialSupply"
                  name="initialSupply"
                  type="number"
                  min="1"
                  value={formData.initialSupply}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Token description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/token-image.png"
              />
            </div>

            <div>
              <Label htmlFor="external_url">External URL</Label>
              <Input
                id="external_url"
                name="external_url"
                value={formData.external_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={deployState.isDeploying}
            >
              {deployState.isDeploying ? 'Deploying...' : 'Deploy Token'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
