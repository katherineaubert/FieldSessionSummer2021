/* eslint-disable @typescript-eslint/camelcase */

export interface Asset {
  hash: string;
  previous_hash?: string;
  asset_id: string;
  timestamp: Date;
  type: string;
  operation: string;
  owners: string[];
  signer: string;
  signature: string;
  dictionary: string;
  digest_alg: string;
  asset: any;
  asset_metadata?: object;
}

export interface AssetVerification {
  hashVerified: boolean;
  assetSignatureVerified: boolean;
}

