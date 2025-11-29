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

class Asset(Base):
    __tablename__ = "assets"
    asset_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    asset_type = Column(
        Enum(
            "login_credential",
            "crypto_wallet",
            "document",
            "social_media",
            "financial",
            "other",
            name="asset_type_enum",
        )
    )
    platform_name = Column(String(255))
    asset_name = Column(String(255))
    username = Column(String(255))  # Encrypted
    password = Column(String(255))  # Encrypted
    recovery_email = Column(String(255))  # Encrypted
    recovery_phone = Column(String(255))  # Encrypted
    notes = Column(Text)  # Encrypted
    category = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    last_accessed = Column(DateTime)

    user = relationship("User", back_populates="assets")
    asset_files = relationship("AssetFile", back_populates="asset")
    access_rules = relationship("AccessRule", back_populates="asset")
    access_logs = relationship("AccessLog", back_populates="asset")
    crypto_asset = relationship("CryptoAsset", back_populates="asset", uselist=False, cascade="all, delete-orphan")

    @property
    def beneficiaries(self):
        return [rule.beneficiary for rule in self.access_rules]
