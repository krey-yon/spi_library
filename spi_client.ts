import type { Keypair, PublicKey } from "@solana/web3.js";
import anchorClient from "./shared/anchor";
import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import { createQR, findReference } from "@solana/pay";
import type { Spi } from "./shared/program/spi";

export default class SpiClient {
  public keypair: Keypair;
  public rpc_url: string;
  public program: Program<Spi>;
  public provider: AnchorProvider;

  constructor(keypair: Keypair, rpc_url: string) {
    this.keypair = keypair;
    this.rpc_url = rpc_url;
    const { program, provider } = anchorClient(this.keypair, this.rpc_url);

    this.program = program;
    this.provider = provider;
  }

  /**
   * Create a new SPL token
   * name: "Kreyon"
   * symbol: "KRYN"
   * metadata: "https://your-ipfs-or-api-url.com"
   */
  async create_token(name: string, symbol: string, metadata: string) {
    const tx = await this.program.methods
      .createToken(name, symbol, metadata)
      .accounts({})
      .signers([this.keypair])
      .rpc();
    return tx;
  }
  /**
   * takes your txns instructions endpoint as input and generates a solana pay QR code for it
   * @param endpoint
   * @returns
   */
  get_qr_code(endpoint: string, size: number) {
    const qr = createQR(`solana:${endpoint}`, size);
    return qr;
  }

  async confirm_payment(referenceKey: PublicKey) {
    const ref = await findReference(this.provider.connection, referenceKey, {
      finality: "confirmed",
    });

    if (ref.signature !== null) {
      console.log("Payment confirmed");
      return true;
    } else {
      console.log("Payment not confirmed");
      return false;
    }
  }
}
