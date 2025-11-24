import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Enum,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class UserMessage(Base):
    __tablename__ = "user_messages"
    message_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    beneficiary_id = Column(
        String(36), ForeignKey("beneficiaries.beneficiary_id"), nullable=True
    )
    message_title = Column(String(255))
    message_content = Column(Text)  # Encrypted
    created_at = Column(DateTime, server_default=func.now())
    delivery_condition = Column(
        Enum(
            "upon_death",
            "after_verification",
            "scheduled_date",
            name="delivery_condition_enum",
        )
    )
    delivered = Column(Boolean, default=False)
    delivered_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="user_messages")
    beneficiary = relationship("Beneficiary", back_populates="user_messages")
