from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from .asset import AssetTypeEnum

class CryptoAssetBase(BaseModel):
    wallet_type: str
    wallet_address: str
    private_key: str
    seed_phrase: str
    balance_usd: Decimal
    balance_crypto: Decimal

class CryptoAssetCreate(CryptoAssetBase):
    pass

class CryptoAsset(CryptoAssetBase):
    crypto_asset_id: str

    class Config:
        orm_mode = True

class CryptoAllocationBase(BaseModel):
    beneficiary_id: str
    percentage: Decimal

class CryptoAllocationCreate(CryptoAllocationBase):
    pass

class CryptoAllocation(CryptoAllocationBase):
    allocation_id: str
    crypto_asset_id: str
    allocated_amount_usd: Decimal
    allocated_amount_crypto: Decimal
    disbursement_status: str
    mock_transaction_id: str

    class Config:
        orm_mode = True
