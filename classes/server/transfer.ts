import type { Program, AnchorProvider } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import type { Spi } from "../../shared/program/spi";
import type { PublicKey } from "@solana/web3.js";
import algorithm from "../../shared/algorithm";
import { updatedAsa } from "./asa";

type Algorithim = "SPI_ALGO_1" | "SPI_ALGO_2" | "SPI_ALGO_3";

export default async function spiTransfer(
  program: Program<Spi>,
  provider: AnchorProvider,
  merchant: PublicKey,
  tokenMint: PublicKey,
  transferAmount: number,
  seeds: string,
  userKey: PublicKey,
  referenceKey: PublicKey,
  discount: number,
  rewardAlgo: Algorithim,
) {
  const mintAmount = await algorithm(
    rewardAlgo || "SPI_ALGO_1",
    seeds,
    userKey,
    transferAmount,
    program,
  );

  const [userAsaPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seeds), userKey.toBuffer()],
    program.programId,
  );

  const accountInfo =
    await program.provider.connection.getAccountInfo(userAsaPda);

  const tx = await program.methods
    .mainTransfer(
      new anchor.BN(transferAmount),
      new anchor.BN(mintAmount),
      discount,
    )
    .accounts({
      merchant: merchant,
      sender: userKey,
      spiMint: tokenMint,
    })
    .instruction();

  const { blockhash } = await program.provider.connection.getLatestBlockhash();

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

  if (accountInfo) {
    updatedAsa(
      10_000,
      120_000,
      program.provider.connection,
      program,
      provider,
      seeds,
      mintAmount,
      transferAmount,
      discount,
      userKey,
      referenceKey,
    );
  }

  return {
    transaction: base64,
    message: `Transfer of ${transferAmount} to ${userKey.toBase58()} for ${discount}% discount`,
  };
}
