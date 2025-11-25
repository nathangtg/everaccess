export interface User {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Asset {
  asset_id: string;
  asset_type: 'login_credential' | 'crypto_wallet' | 'document' | 'social_media' | 'financial' | 'other';
  asset_name: string;
  platform_name?: string;
  username?: string;
  password?: string;
  recovery_email?: string;
  recovery_phone?: string;
  notes?: string;
  category?: string;
}

export interface AssetCreate {
  asset_type: 'login_credential' | 'crypto_wallet' | 'document' | 'social_media' | 'financial' | 'other';
  asset_name: string;
  platform_name?: string;
  username?: string;
  password?: string;
  recovery_email?: string;
  recovery_phone?: string;
  notes?: string;
  category?: string;
}

export interface Beneficiary {
  beneficiary_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  relationship_type?: string;
}

export interface BeneficiaryCreate {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  relationship_type?: string;
}

export interface CryptoAsset {
  crypto_asset_id: string;
  wallet_type: string;
  wallet_address: string;
  balance_usd: number;
  balance_crypto: number;
}

export interface CryptoAssetCreate {
  wallet_type: string;
  wallet_address: string;
  private_key: string;
  seed_phrase: string;
  balance_usd: number;
  balance_crypto: number;
}
