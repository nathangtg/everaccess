import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    ForeignKey,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class AccessLog(Base):
    __tablename__ = "access_logs"
    log_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    beneficiary_id = Column(
        String(36), ForeignKey("beneficiaries.beneficiary_id"), nullable=True
    )
    asset_id = Column(String(36), ForeignKey("assets.asset_id"), nullable=True)
    action_type = Column(
        Enum(
            "login",
            "view_asset",
            "download",
            "update",
            "delete",
            "access_granted",
            name="action_type_enum",
        )
    )
    ip_address = Column(String(45))
    user_agent = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
    status = Column(Enum("success", "failed", "blocked", name="log_status_enum"))
    details = Column(JSON)

    user = relationship("User", back_populates="access_logs")
    beneficiary = relationship("Beneficiary", back_populates="access_logs")
    asset = relationship("Asset", back_populates="access_logs")
