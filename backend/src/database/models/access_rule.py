import uuid
from sqlalchemy import (
    Column,
    Enum,
    DateTime,
    ForeignKey,
    JSON,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class AccessRule(Base):
    __tablename__ = "access_rules"
    rule_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    beneficiary_id = Column(String(36), ForeignKey("beneficiaries.beneficiary_id"))
    asset_id = Column(String(36), ForeignKey("assets.asset_id"), nullable=True)
    access_type = Column(Enum("full", "view_only", "download", name="access_type_enum"))
    conditions = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("User", back_populates="access_rules")
    beneficiary = relationship("Beneficiary", back_populates="access_rules")
    asset = relationship("Asset", back_populates="access_rules")
