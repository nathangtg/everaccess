from pydantic import BaseModel, EmailStr
from typing import Optional

class BeneficiaryBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    relationship_type: Optional[str] = None

class BeneficiaryCreate(BeneficiaryBase):
    pass

class BeneficiaryUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    relationship_type: Optional[str] = None

class Beneficiary(BeneficiaryBase):
    beneficiary_id: str
    is_registered: bool

    class Config:
        from_attributes = True
