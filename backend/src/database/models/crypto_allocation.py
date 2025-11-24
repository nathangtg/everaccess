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

class CryptoAllocation(Base):
    __tablename__ = "crypto_allocations"
    allocation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crypto_asset_id = Column(String(36), ForeignKey("crypto_assets.crypto_asset_id"))
    beneficiary_id = Column(String(36), ForeignKey("beneficiaries.beneficiary_id"))
    percentage = Column(DECIMAL)
    allocated_amount_usd = Column(DECIMAL)
    allocated_amount_crypto = Column(DECIMAL)
    disbursement_status = Column(Enum("pending", "approved", "disbursed", name="disbursement_status_enum"))
    mock_transaction_id = Column(String(255))
    disbursed_at = Column(DateTime)

    crypto_asset = relationship("CryptoAsset", back_populates="allocations")
    beneficiary = relationship("Beneficiary", back_populates="crypto_allocations")
