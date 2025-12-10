from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from ..schemas.beneficiary import Beneficiary

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
    beneficiary_ids: Optional[List[str]] = []

class AssetUpdate(BaseModel):
    asset_type: Optional[AssetTypeEnum] = None
    platform_name: Optional[str] = None
    asset_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    recovery_email: Optional[str] = None
    recovery_phone: Optional[str] = None
    notes: Optional[str] = None
    category: Optional[str] = None
    beneficiary_ids: Optional[List[str]] = None

class AssetFile(BaseModel):
    file_id: str
    file_name: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    
    class Config:
        from_attributes = True

class Asset(AssetBase):
    asset_id: str
    beneficiaries: Optional[List[Beneficiary]] = []
    asset_files: Optional[List[AssetFile]] = []

    class Config:
        from_attributes = True
