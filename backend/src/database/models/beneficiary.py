import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Enum,
    DateTime,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    beneficiary_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    email = Column(String(255), nullable=False)
    first_name = Column(String(255))
    last_name = Column(String(255))
    phone_number = Column(String(255))
    relationship_type = Column(String(255))
    priority_level = Column(Integer)
    added_date = Column(DateTime, server_default=func.now())
    status = Column(
        Enum("active", "inactive", "revoked", name="beneficiary_status_enum"),
        default="active",
    )
    notification_sent = Column(Boolean, default=False)

    user = relationship("User", back_populates="beneficiaries")
    access_rules = relationship("AccessRule", back_populates="beneficiary")
    verification_requests = relationship(
        "VerificationRequest", back_populates="beneficiary"
    )
    access_logs = relationship("AccessLog", back_populates="beneficiary")
    notifications = relationship("Notification", back_populates="beneficiary")
    user_messages = relationship("UserMessage", back_populates="beneficiary")
    crypto_allocations = relationship("CryptoAllocation", back_populates="beneficiary")
