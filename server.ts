/**
 * Server-only exports (Node.js/API routes only)
 * ⚠️ Do NOT import this in Client Components
 */

export { default as SpiServer } from "./spi_server.js";

// Server-side utilities
export {
  hexProofToAnchorFormat,
  anchorProofToHex,
  daysFromNow,
  unixToShortDate,
  bnToCleanNumber,
} from "./utils/index.js";

export { default as algorithm } from "./shared/algorithm.js";

// Type exports
export type { Spi } from "./shared/program/spi.js";
export type { Keypair, PublicKey, Connection } from "@solana/web3.js";
export type { AnchorProvider, Program } from "@coral-xyz/anchor";
