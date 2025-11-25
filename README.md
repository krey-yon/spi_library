# @kreyon/spi_library

[![npm version](https://img.shields.io/npm/v/@kreyon/spi_library.svg)](https://www.npmjs.com/package/@kreyon/spi_library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive Solana Payment Integration library with built-in loyalty rewards, membership management, and dynamic NFT generation. Built on top of Solana Pay and Anchor framework.

## 🌟 Features

- **💳 Solana Pay Integration** - Generate QR codes and handle payments seamlessly
- **🎁 Loyalty Rewards System** - Multiple reward algorithms to incentivize customer engagement
- **👑 Membership Management** - Monthly and yearly subscription plans
- **🖼️ Dynamic NFT Generation** - Auto-generated NFT membership cards with user stats
- **🔒 Merkle Tree Whitelisting** - Built-in support for user verification
- **📊 Transaction Analytics** - Track spending, cashback, and loyalty points
- **🎯 Flexible Discount System** - Apply custom discounts to transactions

## 📦 Installation

```bash
npm install @kreyon/spi_library
# or
yarn add @kreyon/spi_library
# or
bun add @kreyon/spi_library
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install @coral-xyz/anchor @solana/pay @solana/web3.js sharp
```

## 🚀 Quick Start

### For Next.js Applications

The library provides separate exports for client and server components:

```typescript
// Client Component
import { SpiClient } from "@kreyon/spi_library/client";

// Server Component / API Routes
import { SpiServer } from "@kreyon/spi_library/server";
```

### For Other Frameworks

```typescript
import { SpiClient, SpiServer } from "@kreyon/spi_library";
```

## 📚 API Documentation

### SpiServer (Server-Side)

The `SpiServer` class handles all server-side operations including payment processing, membership management, and NFT generation.

#### Constructor

```typescript
const spiServer = new SpiServer(
  keypair: Keypair,           // Your merchant wallet keypair
  rpc_url: string,            // Solana RPC endpoint URL
  store_name: string,         // Your store/business name
  nft_art?: string            // Optional: Custom NFT artwork URL
);
```

**Example:**

```typescript
import { SpiServer } from "@kreyon/spi_library/server";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Initialize your keypair (from environment variable)
const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.MERCHANT_PRIVATE_KEY!)
);

const spiServer = new SpiServer(
  keypair,
  "https://api.devnet.solana.com",
  "My Awesome Store",
  "https://example.com/custom-nft-art.png" // Optional
);
```

#### Methods

##### `getTransferReq()`

Returns the basic transfer request metadata for Solana Pay.

```typescript
const metadata = spiServer.getTransferReq();
// Returns: { label: "My Awesome Store", icon: "..." }
```

##### `transfer()`

Creates a Solana Pay transaction for payment with rewards.

```typescript
async transfer(
  referenceKey: PublicKey,      // Unique reference for this transaction
  amount: number,               // Amount in lamports
  userKey: PublicKey,           // Customer's wallet address
  discount: number,             // Discount percentage (0-100)
  rewardAlgo: "SPI_ALGO_1" | "SPI_ALGO_2" | "SPI_ALGO_3"
): Promise<{ transaction: string, message: string }>
```

**Example:**

```typescript
import { PublicKey, Keypair } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// Generate a unique reference for this transaction
const reference = Keypair.generate().publicKey;
const userWallet = new PublicKey("user_wallet_address_here");

const result = await spiServer.transfer(
  reference,
  0.5 * LAMPORTS_PER_SOL,  // 0.5 SOL
  userWallet,
  10,                       // 10% discount
  "SPI_ALGO_1"             // Reward algorithm
);

// result.transaction contains base64 encoded transaction
// Send this to the client for signing
```

##### `prime_membership()`

Creates a membership subscription transaction.

```typescript
async prime_membership(
  referenceKey: PublicKey,
  userKey: PublicKey,
  name: string,                          // User's name
  validity: "MONTHLY" | "YEARLY"
): Promise<{ transaction: string, message: string }>
```

**Example:**

```typescript
const reference = Keypair.generate().publicKey;
const userWallet = new PublicKey("user_wallet_address");

const membership = await spiServer.prime_membership(
  reference,
  userWallet,
  "John Doe",
  "MONTHLY"  // 0.1 SOL for monthly, 0.2 SOL for yearly
);

// Returns serialized transaction for client to sign
```

##### `getNftArt()`

Generates a dynamic NFT image with user statistics.

```typescript
async getNftArt(userKey: PublicKey): Promise<Buffer>
```

**Example:**

```typescript
const userWallet = new PublicKey("user_wallet_address");
const nftImageBuffer = await spiServer.getNftArt(userWallet);

// Use the buffer to create an NFT or serve as an image
// For Next.js API routes:
return new Response(nftImageBuffer, {
  headers: { "Content-Type": "image/jpeg" }
});
```

### SpiClient (Client-Side)

The `SpiClient` class handles client-side operations like token creation, QR code generation, and payment confirmation.

#### Constructor

```typescript
const spiClient = new SpiClient(
  keypair: Keypair,    // Client wallet keypair
  rpc_url: string      // Solana RPC endpoint
);
```

**Example:**

```typescript
import { SpiClient } from "@kreyon/spi_library/client";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.generate(); // Or use existing wallet
const spiClient = new SpiClient(
  wallet,
  "https://api.devnet.solana.com"
);
```

#### Methods

##### `create_token()`

Creates a new SPL token.

```typescript
async create_token(
  name: string,
  symbol: string,
  metadata: string
): Promise<string>  // Returns transaction signature
```

**Example:**

```typescript
const txSignature = await spiClient.create_token(
  "Kreyon Token",
  "KRYN",
  "https://arweave.net/token-metadata.json"
);
console.log(`Token created: https://solscan.io/tx/${txSignature}`);
```

##### `get_qr_code()`

Generates a Solana Pay QR code.

```typescript
get_qr_code(endpoint: string, size: number): QRCode
```

**Example:**

```typescript
const qrCode = spiClient.get_qr_code(
  "https://mystore.com/api/pay",
  512  // QR code size in pixels
);

// In React:
// <img src={qrCode.toDataURL()} alt="Scan to pay" />
```

##### `confirm_payment()`

Confirms a payment transaction using a reference key.

```typescript
async confirm_payment(referenceKey: PublicKey): Promise<boolean>
```

**Example:**

```typescript
import { PublicKey } from "@solana/web3.js";

const reference = new PublicKey("reference_public_key");
const isConfirmed = await spiClient.confirm_payment(reference);

if (isConfirmed) {
  console.log("Payment confirmed!");
  // Update UI, grant access, etc.
}
```

## 🎯 Reward Algorithms

The library includes three built-in reward algorithms:

### SPI_ALGO_1 (Balanced)
- **Base reward:** 1% of transaction amount
- **Loyalty bonus:** Based on total transactions (1 + transactions/10,000)
- **Spend bonus:** Based on total spent (1 + total_spent/100,000)
- **Best for:** General retail, moderate engagement

### SPI_ALGO_2 (Generous)
- **Base reward:** 2.5% of transaction amount
- **Loyalty bonus:** Based on total transactions (1 + transactions/5,000)
- **Spend bonus:** Based on total spent (1 + total_spent/50,000)
- **Best for:** High-value customers, premium stores

### SPI_ALGO_3 (Conservative)
- **Base reward:** 0.25% of transaction amount
- **Loyalty bonus:** Based on total transactions (1 + transactions/20,000)
- **Fraud control:** Reduces rewards based on cashback ratio
- **Best for:** High-risk environments, fraud prevention

## 🛠️ Utility Functions

### hexProofToAnchorFormat()

Converts hex proof array to Anchor-compatible format.

```typescript
import { hexProofToAnchorFormat } from "@kreyon/spi_library/server";

const hexProof = ["0xabc123...", "0xdef456..."];
const anchorProof = hexProofToAnchorFormat(hexProof);
```

### anchorProofToHex()

Converts Anchor proof format back to hex strings.

```typescript
import { anchorProofToHex } from "@kreyon/spi_library/server";

const hexProof = anchorProofToHex(anchorFormatProof);
```

### daysFromNow()

Returns UNIX timestamp for X days in the future.

```typescript
import { daysFromNow } from "@kreyon/spi_library/server";

const thirtyDaysLater = daysFromNow(30);
```

### unixToShortDate()

Converts UNIX timestamp to readable date format.

```typescript
import { unixToShortDate } from "@kreyon/spi_library/server";

const date = unixToShortDate(1704067200);
// Returns: "01 Jan 2024"
```

### bnToCleanNumber()

Converts Anchor BN (BigNumber) to regular number.

```typescript
import { bnToCleanNumber } from "@kreyon/spi_library/server";

const cleanNumber = bnToCleanNumber(anchorBN);
```

## 💡 Complete Examples

### Next.js API Route (Payment Endpoint)

```typescript
// app/api/pay/route.ts
import { SpiServer } from "@kreyon/spi_library/server";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";

const spiServer = new SpiServer(
  Keypair.fromSecretKey(bs58.decode(process.env.MERCHANT_PRIVATE_KEY!)),
  process.env.RPC_URL!,
  "My Store"
);

export async function POST(req: NextRequest) {
  try {
    const { account, amount, discount } = await req.json();
    
    const reference = Keypair.generate().publicKey;
    const userWallet = new PublicKey(account);
    
    const result = await spiServer.transfer(
      reference,
      amount * LAMPORTS_PER_SOL,
      userWallet,
      discount || 0,
      "SPI_ALGO_1"
    );
    
    return NextResponse.json({
      transaction: result.transaction,
      message: result.message,
      reference: reference.toBase58()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json(spiServer.getTransferReq());
}
```

### Next.js API Route (Membership)

```typescript
// app/api/membership/route.ts
import { SpiServer } from "@kreyon/spi_library/server";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";

const spiServer = new SpiServer(
  Keypair.fromSecretKey(bs58.decode(process.env.MERCHANT_PRIVATE_KEY!)),
  process.env.RPC_URL!,
  "My Store"
);

export async function POST(req: NextRequest) {
  const { account, name, plan } = await req.json();
  
  const reference = Keypair.generate().publicKey;
  const userWallet = new PublicKey(account);
  
  const result = await spiServer.prime_membership(
    reference,
    userWallet,
    name,
    plan // "MONTHLY" or "YEARLY"
  );
  
  return NextResponse.json({
    transaction: result.transaction,
    message: result.message
  });
}
```

### Next.js API Route (Dynamic NFT)

```typescript
// app/api/nft/[wallet]/route.ts
import { SpiServer } from "@kreyon/spi_library/server";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";

const spiServer = new SpiServer(
  Keypair.fromSecretKey(bs58.decode(process.env.MERCHANT_PRIVATE_KEY!)),
  process.env.RPC_URL!,
  "My Store"
);

export async function GET(
  req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const userWallet = new PublicKey(params.wallet);
    const nftBuffer = await spiServer.getNftArt(userWallet);
    
    return new Response(nftBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate NFT" },
      { status: 500 }
    );
  }
}
```

### React Component (Payment QR Code)

```typescript
// components/PaymentQR.tsx
"use client";

import { SpiClient } from "@kreyon/spi_library/client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function PaymentQR() {
  const { publicKey } = useWallet();
  const [qrCode, setQrCode] = useState<string>("");
  
  useEffect(() => {
    if (publicKey) {
      const endpoint = `${window.location.origin}/api/pay?account=${publicKey.toBase58()}`;
      
      // Note: SpiClient needs a keypair, but for QR generation only,
      // you can create it without actual signing
      const qr = createQR(endpoint, 512);
      setQrCode(qr.toDataURL());
    }
  }, [publicKey]);
  
  return qrCode ? (
    <img src={qrCode} alt="Scan to pay with Solana" />
  ) : (
    <p>Connect wallet to generate QR code</p>
  );
}
```

## 🔧 Environment Variables

Create a `.env.local` file in your project:

```env
MERCHANT_PRIVATE_KEY=your_base58_encoded_private_key
RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

## 📋 TypeScript Support

The library is written in TypeScript and includes full type definitions.

```typescript
import type { 
  Spi, 
  Keypair, 
  PublicKey, 
  Connection,
  AnchorProvider,
  Program
} from "@kreyon/spi_library";
```

## 🏗️ Project Structure

```
spi_library/
├── client.ts           # Client-side exports
├── server.ts           # Server-side exports
├── index.ts            # Combined exports
├── spi_client.ts       # SpiClient class
├── spi_server.ts       # SpiServer class
├── classes/
│   ├── client/         # Client-specific classes
│   └── server/         # Server-specific classes
│       ├── asa.ts      # Account management
│       ├── nft.ts      # NFT generation
│       └── transfer.ts # Payment processing
├── shared/
│   ├── algorithm.ts    # Reward algorithms
│   ├── anchor.ts       # Anchor setup
│   └── program/        # Solana program IDL
└── utils/
    └── index.ts        # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **NPM Package:** [@kreyon/spi_library](https://www.npmjs.com/package/@kreyon/spi_library)
- **Homepage:** [https://spi.kreyon.in](https://spi.kreyon.in)
- **GitHub:** [https://github.com/krey-yon/spi_library](https://github.com/krey-yon/spi_library)
- **Issues:** [Report a bug](https://github.com/krey-yon/spi_library/issues)

## 📞 Support

For questions and support, please open an issue on GitHub or visit our homepage.

## ⚠️ Important Notes

1. **Security:** Never expose your private keys in client-side code
2. **Network:** Make sure to use the correct RPC endpoint (devnet/mainnet)
3. **Dependencies:** Ensure all peer dependencies are installed
4. **Next.js:** Use proper client/server imports to avoid build errors
5. **Testing:** Always test on devnet before deploying to mainnet

## 🎓 Learn More

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Pay](https://solanapay.com/)

---

Made with ❤️ by [Vikas](https://github.com/krey-yon)