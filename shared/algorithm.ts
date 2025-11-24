import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { Spi } from "./program/spi";

type Algorithim = "SPI_ALGO_1" | "SPI_ALGO_2" | "SPI_ALGO_3";

export default async function algorithm(
  algorithm: Algorithim,
  seeds: string,
  userKey: PublicKey,
  transfer_amount: number,
  program: anchor.Program<Spi>,
) {
  const [userAsaPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seeds), userKey.toBuffer()],
    program.programId,
  );

  const asaData = await program.account.userAsa.fetch(userAsaPda);

  const userInfo = {
    transfer_amount,
    spi_tokens: asaData.spiTokens,
    total_transactions: asaData.totalTransactions,
    total_spent: asaData.totalSpent,
    total_cashback: asaData.totalCashback
  };

  switch (algorithm) {
    case "SPI_ALGO_1": {
      const base = userInfo.transfer_amount * 0.01;      // 1% of spend
    
      const loyalty_bonus = 1 + (userInfo.total_transactions / 10000);
    
      const spend_bonus = 1 + (userInfo.total_spent / 100000);
    
      const new_points = base * loyalty_bonus * spend_bonus;
      
      return new_points;
    }

    case "SPI_ALGO_2": {
      const base = userInfo.transfer_amount * 0.025;      // 2.5% reward
    
      const loyalty_bonus = 1 + (userInfo.total_transactions / 5000);
    
      const spend_bonus = 1 + (userInfo.total_spent / 50000);
    
      const new_points = base * loyalty_bonus * spend_bonus;
    
      return new_points;
    }

    case "SPI_ALGO_3": {
      const base = userInfo.transfer_amount * 0.0025;    // 0.25% reward
    
      const loyalty_bonus = 1 + (userInfo.total_transactions / 20000);
    
      const fraud_control = 1 - (userInfo.total_cashback / (userInfo.total_spent + 1));
    
      const new_points = base * loyalty_bonus * fraud_control;
    
      return new_points;
    }

    default:
      throw new Error("Invalid algorithm");
  }
}
