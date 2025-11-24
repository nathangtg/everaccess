import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Enum,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(512), nullable=False)
    first_name = Column(String(255))
    last_name = Column(String(255))
    phone_number = Column(String(255))
    date_of_birth = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    last_login = Column(DateTime)
    account_status = Column(
        Enum(
            "active",
            "suspended",
            "deceased",
            "deleted",
            name="account_status_enum",
        ),
        default="active",
    )
    email_verified = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255))  # Encrypted

    subscriptions = relationship("Subscription", back_populates="user")
    beneficiaries = relationship("Beneficiary", back_populates="user")
    assets = relationship("Asset", back_populates="user")
    access_rules = relationship("AccessRule", back_populates="user")
    verification_requests = relationship("VerificationRequest", back_populates="user")
    access_logs = relationship("AccessLog", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    partner_clients = relationship("PartnerClient", back_populates="user")
    encryption_keys = relationship("EncryptionKey", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    user_messages = relationship("UserMessage", back_populates="user")
