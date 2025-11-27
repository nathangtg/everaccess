from pydantic import BaseModel
from typing import Optional
from enum import Enum

class AssetTypeEnum(str, Enum):
    login_credential = "login_credential"
    crypto_wallet = "crypto_wallet"
    document = "document"
    social_media = "social_media"
    financial = "financial"
    other = "other"

class AssetBase(BaseModel):
    asset_type: AssetTypeEnum
    platform_name: Optional[str] = None
    asset_name: str
    username: Optional[str] = None
    password: Optional[str] = None
    recovery_email: Optional[str] = None
    recovery_phone: Optional[str] = None
    notes: Optional[str] = None
    category: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    asset_id: str

    class Config:
        from_attributes = True
