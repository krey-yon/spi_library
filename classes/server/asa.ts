import type { Program, AnchorProvider } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import type { Spi } from "../../shared/program/spi";
import type { Connection, PublicKey } from "@solana/web3.js";
import { daysFromNow, hexProofToAnchorFormat } from "../../utils";
import { findReference } from "@solana/pay";

type PlanDuration = "MONTHLY" | "YEARLY";

export async function createAsa(
  program: Program<Spi>,
  provider: AnchorProvider,
  seeds: string,
  name: string,
  userKey: PublicKey,
  planDuration: PlanDuration,
) {
  //todo create and implement merkletree logic
  const proof = [
    "fd7f803a00de8e8057ccfcb61f955bd25d5968a77335157f821fe3acec40d5d0",
    "cdafd9617bd97773accf6f4572b21279f37777060df1023546ce28f16aaffe5a",
    "c391681d716b81c79a4a4375cc01eaffbe037150d1bf2fc8f937bc95006c9f15",
    "8d53de91682738accd2138c9ce08f5a5a677dfde75cb229fc93884d766202435",
  ];

  const proofBytes = hexProofToAnchorFormat(proof);

  const [userAsaPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seeds), userKey.toBuffer()],
    program.programId,
  );

  if (planDuration == "MONTHLY") {
    const validTill = daysFromNow(30);

    const tx = await program.methods
      .createUserAsa(name, proofBytes, validTill)
      .accounts({
        authority: provider.wallet.publicKey,
        customer: userKey,
        //@ts-expect-error
        userAsa: userAsaPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(
      `Asa created and is valid for 30 days: https://solscan.io/tx/${tx}?cluster=devnet`,
    );
  } else {
    const validTill = daysFromNow(365);

    const tx = await program.methods
      .createUserAsa(name, proofBytes, validTill)
      .accounts({
        authority: provider.wallet.publicKey,
        customer: userKey,
        //@ts-expect-error
        userAsa: userAsaPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(
      `Asa created and is valid for one year: https://solscan.io/tx/${tx}?cluster=devnet`,
    );
  }
}

export async function updatedAsa(
  intervalMs: number = 10_000,
  timeoutMs: number = 120_000,
  connection: Connection,
  program: Program<Spi>,
  provider: AnchorProvider,
  seeds: string,
  mintAmount: number,
  transferAmount: number,
  discount: number,
  userKey: PublicKey,
  referenceKey: PublicKey,
) {
  const maxAttempts = Math.floor(timeoutMs / intervalMs);
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const txref = await findReference(connection, referenceKey, {
        finality: "confirmed",
      });
      if (txref.signature) {
        const [userAsaPda] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from(seeds), userKey.toBuffer()],
          program.programId,
        );

        const userAsa = await program.account.userAsa.fetch(userAsaPda);

        const newSpiTokens = userAsa.spiTokens + mintAmount;
        const newTotalTransactions = userAsa.totalTransactions + 1;
        const newTotalSpent = userAsa.totalSpent + transferAmount;
        const newTotalCashback =
          userAsa.totalCashback + Math.floor((newTotalSpent * discount) / 100);

        const tx = await program.methods
          .updateUserAsaData(
            new anchor.BN(newSpiTokens),
            null,
            new anchor.BN(newTotalCashback),
            new anchor.BN(newTotalSpent),
            new anchor.BN(newTotalTransactions),
            null,
          )
          .accounts({
            authority: provider.wallet.publicKey,
            customer: userKey,
            //@ts-expect-error
            userAsa: userAsaPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        console.log(
          `user asa updated can check the txn here : https://solscan.io/tx/${tx}?cluster=devnet`,
        );
        break;
      }
      throw new Error("Failed to find reference");
    } catch {
      console.log(`failed finding ref and updating asa`);
    }
    await new Promise((res) => setTimeout(res, intervalMs));
    attempts++;
  }
}
