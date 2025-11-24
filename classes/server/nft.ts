import type { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import sharp from "sharp";
import type { Spi } from "../../shared/program/spi";
import { unixToShortDate } from "../../utils";

export async function getDynamicNft(
  userKey: PublicKey,
  nft_art: string,
  seeds: string,
  program: anchor.Program<Spi>,
) {
  const [userAsaPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seeds), userKey.toBuffer()],
    program.programId,
  );

  const userAsaData = await program.account.userAsa.fetch(userAsaPda);

  const dataToShow = {
    name: userAsaData.name,
    loyalty_points: userAsaData.spiTokens.toNumber(),
    total_cashback: userAsaData.totalCashback.toNumber(),
    total_spent: userAsaData.totalSpent.toNumber(),
    totals_transactions: userAsaData.totalTransactions.toNumber(),
    join_date: unixToShortDate(userAsaData.joinDateUnixTimestamp),
    valid_till_data: unixToShortDate(userAsaData.validTillUnixTimestamp),
  };

  const response = await fetch(nft_art);
  const imageBuffer = Buffer.from(await response.arrayBuffer());

  const template = sharp(imageBuffer);

  const textSvg = `
  <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #ffffff; font-family: Verdana, sans-serif; font-weight: bold; font-size: 26px; }
      .subtitle { fill: #00FFFF; font-family: Courier New, monospace; font-weight: bold; font-size: 14px; letter-spacing: 1px; }
      .label { fill: #aaaaaa; font-family: Verdana, sans-serif; font-size: 12px; font-weight: normal; }
      .value { fill: #ffffff; font-family: Verdana, sans-serif; font-size: 16px; font-weight: bold; }
      .date-val { fill: #e0e0e0; font-family: Courier New, monospace; font-size: 14px; }
    </style>

    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#00FFFF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0088FF;stop-opacity:1" />
      </linearGradient>
    </defs>

    <rect x="20" y="10" width="460" height="190" rx="15" ry="15" fill="rgba(20, 10, 50, 0.9)" />
    <rect x="20" y="10" width="460" height="4" rx="2" ry="2" fill="url(#grad1)" />

    <text x="40" y="55" class="title">${dataToShow.name}</text>

    <text x="440" y="45" text-anchor="end" class="subtitle">LOYALTY LEVEL</text>
    <text x="440" y="65" text-anchor="end" class="value" style="fill: #00FFFF; font-size: 20px;">${dataToShow.loyalty_points} PTS</text>

    <line x1="40" y1="80" x2="460" y2="80" stroke="#333333" stroke-width="1" />

    <text x="40" y="110" class="label">TOTAL SPENT</text>
    <text x="40" y="130" class="value">${dataToShow.total_spent}</text>

    <text x="40" y="160" class="label">CASHBACK EARNED</text>
    <text x="40" y="180" class="value" style="fill: #76ff03;">${dataToShow.total_cashback}</text>

    <text x="200" y="110" class="label">TRANSACTIONS</text>
    <text x="200" y="130" class="value">#${dataToShow.totals_transactions}</text>

    <text x="340" y="110" class="label">MEMBER SINCE</text>
    <text x="340" y="130" class="date-val">${dataToShow.join_date}</text>

    <text x="340" y="160" class="label">VALID UNTIL</text>
    <text x="340" y="180" class="date-val" style="fill: #FF5555;">${dataToShow.valid_till_data}</text>

  </svg>`;

  const finalImage = await template
    .composite([{ input: Buffer.from(textSvg), top: 0, left: 0 }])
    .jpeg()
    .toBuffer();

  return finalImage;
}
