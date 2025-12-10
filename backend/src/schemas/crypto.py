from pydantic import BaseModel, Field, computed_field
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
    
    # We can't easily use computed_field for ORM relationships in Pydantic v1/v2 transition without deeper config,
    # but we can declare the fields and let Pydantic's ORM mode handle it if we structure it right,
    # or usage of property on the SQLAlchemy model. 
    # Since we are using from_attributes=True, we can map them if the ORM model has them.
    # But the ORM model has 'asset.asset_name'.
    
    # Simpler approach: Include the generic Asset schema as a nested object or flattened fields.
    # Let's try flattening with a custom getter or just assuming the API response constructs it.
    # Actually, for Pydantic v2 (which FastAPI likely uses given 'from_attributes'), 
    # we can just add the fields and if they aren't on the model, we need to ensure the route constructs a dict 
    # or the model has properties.
    
    # Let's add them as optional for now, but better yet, let's look at the service.
    # The service returns the ORM object.
    
    # To avoid complex Pydantic config changes, I will add a nested Asset response or just fields.
    # Let's try to add them and rely on a validator or property.
    
    asset_name: Optional[str] = None
    platform_name: Optional[str] = None

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_asset_name(obj):
        return obj.asset.asset_name if obj.asset else None

    @staticmethod
    def resolve_platform_name(obj):
        return obj.asset.platform_name if obj.asset else None

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
        from_attributes = True
