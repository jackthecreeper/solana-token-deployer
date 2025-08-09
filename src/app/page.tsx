'use client';

import { TokenDeployerForm } from '@/components/token-deployer-form';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Solana Token Deployer</h1>
            <p className="text-gray-400">Deploy custom SPL tokens on Solana blockchain</p>
          </div>
          <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white" />
        </div>

        {connected && publicKey && (
          <div className="mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Connected Wallet:</span>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <TokenDeployerForm />
      </div>
    </div>
  );
}
