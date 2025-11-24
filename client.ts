/**
 * Client-only exports (safe for browser/client components)
 */

export { default as SpiClient } from "./spi_client.js";

// Safe utility functions
export {
  hexProofToAnchorFormat,
  anchorProofToHex,
  daysFromNow,
  unixToShortDate,
  bnToCleanNumber,
} from "./utils/index.js";

// Type exports
export type { Spi } from "./shared/program/spi.js";
export type { Keypair, PublicKey, Connection } from "@solana/web3.js";
export type { AnchorProvider, Program } from "@coral-xyz/anchor";
