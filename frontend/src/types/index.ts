export interface User {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface UserAdminView extends User {
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Asset {
  asset_id: string;
  asset_type: 'login_credential' | 'crypto_wallet' | 'document' | 'social_media' | 'financial' | 'other';
  platform_name?: string;
  asset_name: string;
  username?: string;
  password?: string;
  recovery_email?: string;
  recovery_phone?: string;
  notes?: string;
  category?: string;
}

export interface AssetCreate {
  asset_type: 'login_credential' | 'crypto_wallet' | 'document' | 'social_media' | 'financial' | 'other';
  platform_name?: string;
  asset_name: string;
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

export interface CryptoAllocation {
  allocation_id?: string; // Assuming ID might exist
  beneficiary_id: string;
  percentage: number;
}

export interface VerificationRequest {
  request_id?: string; // Assuming ID exists
  requester_email: string;
  user_id: string;
  status?: string;
  created_at?: string;
}

export interface VerificationDocument {
  document_id?: string;
  request_id: string;
  filename: string;
  document_type: string;
  uploaded_at?: string;
}