from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class VerificationStatusEnum(str, Enum):
    pending = "pending"
    under_review = "under_review"
    approved = "approved"
    rejected = "rejected"

class VerificationRequestBase(BaseModel):
    requester_email: EmailStr

class VerificationRequestCreate(VerificationRequestBase):
    user_id: str # The deceased user's ID

class VerificationRequest(VerificationRequestBase):
    request_id: str
    beneficiary_id: str
    status: VerificationStatusEnum

    class Config:
        orm_mode = True

class VerificationDocumentBase(BaseModel):
    document_type: str
    file_name: str

class VerificationDocumentCreate(VerificationDocumentBase):
    pass

class VerificationDocument(VerificationDocumentBase):
    document_id: str
    request_id: str

    class Config:
        orm_mode = True
