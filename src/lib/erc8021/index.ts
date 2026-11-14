import { concat, stringToHex, toHex } from 'viem';

export const BUILDER_CODE = 'bc_h5lelcls';
export const FEED_PHANTOM_APP_ID = '691a0491669aee60603bddd1';
export const FEED_PHANTOM_TARGET_ADDRESS =
  '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7' as const;

const ERC8021_SCHEMA_ID = '0x00' as const;
const ERC8021_MAGIC_BYTES = '0x80218021802180218021802180218021' as const;

export interface TransactionAttribution {
  attributionCode: string;
  builderCode: string;
}

/**
 * Builds an ERC-8021 dataSuffix from the registered Base Builder Code.
 * Format: <1-byte length><ascii code><0x00 schema><16-byte repeating 0x8021>
 */
export function buildERC8021DataSuffix(builderCode: string = BUILDER_CODE): `0x${string}` {
  const codeHex = stringToHex(builderCode);
  const byteLength = (codeHex.length - 2) / 2;
  const lengthHex = toHex(byteLength, { size: 1 });
  return concat([lengthHex, codeHex, ERC8021_SCHEMA_ID, ERC8021_MAGIC_BYTES]);
}

export const ERC8021_DATA_SUFFIX = buildERC8021DataSuffix(BUILDER_CODE);

/**
 * Encodes the run attribution payload into calldata hex for Base Mainnet.
 */
export function encodeERC8021Attribution(appId: string, actionData: string): `0x${string}` {
  const payload = JSON.stringify({
    appId,
    builder: BUILDER_CODE,
    data: JSON.parse(actionData),
  });
  return stringToHex(payload);
}

/**
 * Generates a Base Mainnet transaction request for recording a score with ERC-8021 suffix.
 */
export function buildScoreTransaction(score: number, echoes: number, playerAddress: string) {
  const payloadHex = encodeERC8021Attribution(
    FEED_PHANTOM_APP_ID,
    JSON.stringify({ score, echoes, playerAddress })
  );

  return {
    to: FEED_PHANTOM_TARGET_ADDRESS,
    data: concat([payloadHex, ERC8021_DATA_SUFFIX]),
    value: BigInt(0),
  };
}

