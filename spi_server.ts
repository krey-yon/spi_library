import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  type Connection,
  type Keypair,
} from "@solana/web3.js";
import type { Spi } from "./shared/program/spi";
import anchorClient from "./shared/anchor";
import spiTransfer from "./classes/server/transfer";
import { pollAndGrantMembership } from "./utils";
import { getDynamicNft } from "./classes/server/nft";

type Algorithim = "SPI_ALGO_1" | "SPI_ALGO_2" | "SPI_ALGO_3";
type PlanDuration = "MONTHLY" | "YEARLY";

export default class SpiServer {
  public keypair: Keypair;
  public rpc_url: string;
  public program: Program<Spi>;
  public provider: AnchorProvider;
  public asaSeeds: string;
  public connection: Connection;
  public store_name: string;
  public nft_art: string;

  constructor(
    keypair: Keypair,
    rpc_url: string,
    store_name: string,
    nft_art: string = "https://i.ibb.co/r23TTBVV/Normies-NFT.png",
  ) {
    this.keypair = keypair;
    this.rpc_url = rpc_url;
    const { program, provider } = anchorClient(this.keypair, this.rpc_url);

    this.program = program;
    this.provider = provider;
    this.asaSeeds = "user_asa_spi_trial_24";
    this.connection = provider.connection;
    this.store_name = store_name;
    this.nft_art = nft_art;
  }

  getTransferReq() {
    return {
      label: this.store_name,
      icon: "https://solanapay.com/src/img/branding/Solanapay-logo-with-text.png",
    };
  }

  async transfer(
    referenceKey: PublicKey,
    amount: number,
    userKey: PublicKey,
    discount: number,
    rewardAlgo: Algorithim,
  ) {
    const insturctions = await spiTransfer(
      this.program,
      this.provider,
      this.keypair.publicKey,
      this.keypair.publicKey,
      amount,
      this.asaSeeds,
      userKey,
      referenceKey,
      discount,
      rewardAlgo,
    );
    return insturctions;
  }

  async prime_membership(
    referenceKey: PublicKey,
    userKey: PublicKey,
    name: string,
    validity: PlanDuration,
  ) {
    if (validity == "MONTHLY") {
      const tx = await this.program.methods
        .membership(new anchor.BN(0.1 * LAMPORTS_PER_SOL))
        .accounts({
          merchant: this.keypair.publicKey,
          sender: userKey,
        })
        .instruction();

      const { blockhash } = await this.connection.getLatestBlockhash();

      tx.keys.push({
        pubkey: referenceKey,
        isSigner: false,
        isWritable: false,
      });

      const message = new anchor.web3.TransactionMessage({
        payerKey: userKey,
        recentBlockhash: blockhash,
        instructions: [tx],
      }).compileToV0Message();

      const transaction = new anchor.web3.VersionedTransaction(message);
      const base64 = Buffer.from(transaction.serialize()).toString("base64");

      pollAndGrantMembership(
        10000,
        120000,
        this.program,
        this.provider,
        this.asaSeeds,
        name,
        this.connection,
        "MONTHLY",
        referenceKey,
        userKey,
      );

      return {
        transaction: base64,
        message: `Prime Membership for ${name} (${validity}) for 0.1 SOL`,
      };
    } else if (validity == "YEARLY") {
      const tx = await this.program.methods
        .membership(new anchor.BN(0.2 * LAMPORTS_PER_SOL))
        .accounts({
          merchant: this.keypair.publicKey,
          sender: userKey,
        })
        .instruction();

      const { blockhash } = await this.connection.getLatestBlockhash();

      tx.keys.push({
        pubkey: referenceKey,
        isSigner: false,
        isWritable: false,
      });

      const message = new anchor.web3.TransactionMessage({
        payerKey: userKey,
        recentBlockhash: blockhash,
        instructions: [tx],
      }).compileToV0Message();

      const transaction = new anchor.web3.VersionedTransaction(message);
      const base64 = Buffer.from(transaction.serialize()).toString("base64");

      pollAndGrantMembership(
        10000,
        120000,
        this.program,
        this.provider,
        this.asaSeeds,
        name,
        this.connection,
        "YEARLY",
        referenceKey,
        userKey,
      );

      return {
        transaction: base64,
        message: `Prime Membership for ${name} (${validity}) for 0.2 SOL`,
      };
    }
  }

  async getNftArt(userKey: PublicKey) {
    return await getDynamicNft(
      userKey,
      this.nft_art,
      this.asaSeeds,
      this.program,
    );
  }
}
