from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class DeliveryConditionEnum(str, Enum):
    upon_death = "upon_death"
    after_verification = "after_verification"
    scheduled_date = "scheduled_date"

class UserMessageBase(BaseModel):
    beneficiary_id: Optional[str] = None
    message_title: str
    message_content: str
    delivery_condition: DeliveryConditionEnum

class UserMessageCreate(UserMessageBase):
    pass

class UserMessage(UserMessageBase):
    message_id: str
    user_id: str
    created_at: datetime
    delivered: bool
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True
