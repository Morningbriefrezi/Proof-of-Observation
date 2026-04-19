import { PublicKey } from "@solana/web3.js";

function marketIdLeBytes(marketId: number | bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(typeof marketId === "bigint" ? marketId : BigInt(marketId));
  return buf;
}

export function configPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
}

export function marketPDA(
  programId: PublicKey,
  marketId: number | bigint,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("market"), marketIdLeBytes(marketId)],
    programId,
  );
}

export function vaultPDA(
  programId: PublicKey,
  marketId: number | bigint,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), marketIdLeBytes(marketId)],
    programId,
  );
}

export function positionPDA(
  programId: PublicKey,
  marketId: number | bigint,
  user: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("position"), marketIdLeBytes(marketId), user.toBuffer()],
    programId,
  );
}
