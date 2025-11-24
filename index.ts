/**
 * Solana Payment Integration (SPI) Library
 * 
 * ⚠️ WARNING: This exports both client and server code.
 * For Next.js, use specific imports:
 * - import { SpiClient } from "@kreyon/spi_library/client"
 * - import { SpiServer } from "@kreyon/spi_library/server"
 */

// Export everything (use with caution in Next.js)
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
