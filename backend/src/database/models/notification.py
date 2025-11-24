import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class Notification(Base):
    __tablename__ = "notifications"
    notification_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    beneficiary_id = Column(
        String(36), ForeignKey("beneficiaries.beneficiary_id"), nullable=True
    )
    notification_type = Column(
        Enum(
            "subscription_expiry",
            "verification_update",
            "access_granted",
            "system_alert",
            name="notification_type_enum",
        )
    )
    subject = Column(String(255))
    message = Column(Text)
    sent_at = Column(DateTime, server_default=func.now())
    read_at = Column(DateTime, nullable=True)
    delivery_status = Column(
        Enum("pending", "sent", "failed", name="delivery_status_enum"),
        default="pending",
    )

    user = relationship("User", back_populates="notifications")
    beneficiary = relationship("Beneficiary", back_populates="notifications")
