# Solana Token Deployer

A modern, full-featured web application for deploying custom SPL tokens on the Solana blockchain. Built with Next.js, TypeScript, and Solana Web3.js.

## Features

- 🚀 **Easy Token Creation**: Deploy custom SPL tokens with just a few clicks
- 🔗 **Wallet Integration**: Connect with Phantom, Solflare, and other Solana wallets
- 📊 **Real-time Progress**: Track deployment progress with live updates
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui
- 📝 **Metadata Support**: Upload token metadata and images
- 🔍 **Transaction Explorer**: View transactions on Solscan
- ⚡ **Devnet Support**: Test on devnet before mainnet deployment

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Blockchain**: Solana Web3.js, SPL Token Program
- **Wallet**: Solana Wallet Adapter
- **Styling**: Tailwind CSS, shadcn/ui components
- **Build**: Vercel-ready configuration

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-token-deployer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Optional: Pinata for IPFS uploads
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
```

## Usage

1. **Connect Wallet**: Click "Select Wallet" and choose your preferred Solana wallet
2. **Fill Token Details**: Enter your token name, symbol, decimals, and initial supply
3. **Add Metadata**: Optionally add description, image URL, and external link
4. **Deploy Token**: Click "Deploy Token" and confirm the transaction
5. **Track Progress**: Monitor deployment progress in real-time
6. **View Results**: Copy mint address and view transaction on Solscan

## Token Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Name** | Full token name | "My Awesome Token" |
| **Symbol** | Token ticker (3-10 chars) | "MAT" |
| **Decimals** | Token precision (0-9) | 6 |
| **Initial Supply** | Starting token amount | 1000000 |
| **Description** | Token description | "A revolutionary new token" |
| **Image** | Token logo URL | "https://example.com/logo.png" |

## Development

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main token deployer page
│   └── globals.css         # Global styles
├── components/
│   ├── token-deployer-form.tsx  # Main deployment form
│   ├── providers/
│   │   └── wallet-provider.tsx  # Solana wallet provider
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── solana/
│   │   ├── config.ts       # Solana network configuration
│   │   ├── token-deployer.ts  # Core deployment logic
│   │   ├── metadata-uploader.ts  # Metadata handling
│   │   └── validation.ts   # Input validation
│   └── utils.ts            # Utility functions
├── hooks/
│   └── use-token-deployer.ts  # Custom deployment hook
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

To extend the token deployer:

1. **Add new token parameters**: Update `TokenDeployParams` interface in `token-deployer.ts`
2. **Add validation rules**: Modify validation logic in `validation.ts`
3. **Add UI components**: Use shadcn/ui components from the existing library
4. **Add metadata fields**: Extend `TokenMetadataUpload` interface

## Deployment

### Netlify (Recommended)

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect to Netlify**: Go to [Netlify](https://netlify.com) and connect your GitHub account
3. **Import Repository**: Select your repository from the list
4. **Build Settings**: Netlify will automatically detect the settings from `netlify.toml`
5. **Environment Variables**: Add these in Netlify dashboard:
   - `NEXT_PUBLIC_SOLANA_NETWORK=mainnet`
   - `NEXT_PUBLIC_PINATA_API_KEY` (optional)
   - `NEXT_PUBLIC_PINATA_SECRET_KEY` (optional)
6. **Deploy**: Click "Deploy site" - Netlify will build and deploy automatically

### Manual Netlify CLI Deployment

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod --dir=out
   ```

### Vercel (Alternative)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Self-hosting

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security

- All transactions require user confirmation
- Private keys never leave the user's wallet
- Input validation prevents common attack vectors
- Devnet testing recommended before mainnet deployment

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Program](https://spl.solana.com/token)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## Roadmap

- [ ] Multi-signature support
- [ ] Token management dashboard
- [ ] Batch token deployment
- [ ] Token verification tools
- [ ] Mainnet deployment guide
- [ ] Mobile app version
