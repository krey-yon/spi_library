import type { AnchorProvider, Program } from "@coral-xyz/anchor";
import { findReference } from "@solana/pay";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { Spi } from "../shared/program/spi";
import { createAsa } from "../classes/server/asa";
import * as anchor from "@coral-xyz/anchor";

type PlanDuration = "MONTHLY" | "YEARLY";

/**
 * Convert hex proof array → number[][] (Anchor Vec<[u8; 32]>)
 */
export function hexProofToAnchorFormat(proofHex: string[]): number[][] {
  return proofHex.map((p) => {
    const hex = p.startsWith("0x") ? p.slice(2) : p; // remove 0x prefix
    const buf = Buffer.from(hex, "hex");

    if (buf.length !== 32) {
      throw new Error(
        `Invalid proof element length: ${buf.length}, expected 32`,
      );
    }

    return Array.from(buf); // number[32]
  });
}

/**
 * Convert Anchor Vec<[u8;32]> → hex array
 */
export function anchorProofToHex(merkleProof: number[][]): string[] {
  return merkleProof.map((arr) => {
    const buf = Buffer.from(arr);
    return buf.toString("hex");
  });
}

/**
 * Returns a UNIX timestamp (in seconds) for X days from now.
 */
export function daysFromNow(days: number): number {
  const now = Math.floor(Date.now() / 1000); // seconds
  return now + days * 24 * 60 * 60;
}

/**
 * Polls an async function every `intervalMs` until it succeeds
 * or until timeout is reached.
 *
 * @param callback      The async function to retry
 * @param intervalMs    How long to wait between attempts (default 10 sec)
 * @param timeoutMs     Max total wait time (default 2 minutes)
 */
export async function pollAndGrantMembership<T>(
  intervalMs: number = 10_000,
  timeoutMs: number = 120_000,
  program: Program<Spi>,
  provider: AnchorProvider,
  seeds: string,
  name: string,
  connection: Connection,
  planDuration: PlanDuration,
  refKey: PublicKey,
  userKey: PublicKey,
): Promise<T> {
  const maxAttempts = Math.floor(timeoutMs / intervalMs);
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const tx = await findReference(connection, refKey, {
        finality: "confirmed",
      });
      if (tx.signature) {
        await createAsa(program, provider, seeds, name, userKey, planDuration);
        break;
      }
      throw new Error("Failed to find reference");
    } catch (err) {
      // Callback failed → wait and retry
      console.log(`Attempt ${attempts + 1} failed, retrying...`, err);
    }

    await new Promise((res) => setTimeout(res, intervalMs));
    attempts++;
  }

  throw new Error(`Polling timed out after ${timeoutMs / 1000} seconds`);
}

export function unixToShortDate(unixTimestamp: number): string {
  if (!unixTimestamp || isNaN(unixTimestamp)) return "Invalid date";
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function bnToCleanNumber(bnValue: any) {
  return bnValue.toNumber();
}
