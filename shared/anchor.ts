import * as anchor from "@coral-xyz/anchor";
import idl from "./program/idl.json";
import { type Spi } from "./program/spi";
import { Keypair } from "@solana/web3.js";

// const keypair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));

//program id check for it
// const programId = new anchor.web3.PublicKey("2RakX2uLr5Pm3NftQq9X8YatfqHseM8qc5J2DvvaAPDB");

export default function anchorClient(keypair: Keypair, rpc_url: string) {
  const connection = new anchor.web3.Connection(rpc_url);

  const wallet = {
    publicKey: keypair.publicKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signTransaction: async (tx: any) => {
      tx.partialSign(keypair);
      return tx;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signAllTransactions: async (txs: any[]) => {
      return txs.map((tx) => {
        tx.partialSign(keypair);
        return tx;
      });
    },
  };

  const provider = new anchor.AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
  });

  const program = new anchor.Program(
    idl as anchor.Idl,
    provider,
  ) as anchor.Program<Spi>;

  return { program, provider };
}
