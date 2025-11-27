from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from ..schemas.user import UserOut

class AdminUserOut(BaseModel):
    admin_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True

class UserAdminView(UserOut):
    # This extends UserOut with fields visible only to admin
    last_login: Optional[datetime] = None
    account_status: str
    email_verified: bool
    mfa_enabled: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
