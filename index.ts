/**
 * Solana Payment Integration (SPI) Library
 * 
 * Main exports for client and server-side Solana payment operations
 * with loyalty rewards, memberships, and dynamic NFT generation.
 */

// Core classes
export { default as SpiClient } from "./spi_client.js";
export { default as SpiServer } from "./spi_server.js";

// Utility functions
export {
  hexProofToAnchorFormat,
  anchorProofToHex,
  daysFromNow,
  unixToShortDate,
  bnToCleanNumber,
} from "./utils/index.js";

// Algorithm for custom reward calculations
export { default as algorithm } from "./shared/algorithm.js";

// Type exports for TypeScript users
export type { Spi } from "./shared/program/spi.js";

// Re-export common types from dependencies for convenience
export type { Keypair, PublicKey, Connection } from "@solana/web3.js";
export type { AnchorProvider, Program } from "@coral-xyz/anchor";
