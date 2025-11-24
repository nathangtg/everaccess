import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    ForeignKey,
    DECIMAL,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class CryptoAsset(Base):
    __tablename__ = "crypto_assets"
    crypto_asset_id = Column(String(36), ForeignKey("assets.asset_id"), primary_key=True)
    wallet_type = Column(Enum("bitcoin", "ethereum", "usdt", name="wallet_type_enum"))
    wallet_address = Column(String(255))
    private_key = Column(String(512))  # Encrypted
    seed_phrase = Column(String(512))  # Encrypted
    balance_usd = Column(DECIMAL)
    balance_crypto = Column(DECIMAL)
    last_updated = Column(DateTime, onupdate=func.now())

    asset = relationship("Asset", back_populates="crypto_asset")
    allocations = relationship("CryptoAllocation", back_populates="crypto_asset")
