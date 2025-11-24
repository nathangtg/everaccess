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

class VerificationRequest(Base):
    __tablename__ = "verification_requests"
    request_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    beneficiary_id = Column(String(36), ForeignKey("beneficiaries.beneficiary_id"))
    requester_email = Column(String(255))
    request_date = Column(DateTime, server_default=func.now())
    status = Column(
        Enum(
            "pending",
            "under_review",
            "approved",
            "rejected",
            name="request_status_enum",
        ),
        default="pending",
    )
    reviewed_by = Column(
        String(36), ForeignKey("admin_users.admin_id"), nullable=True
    )
    reviewed_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    approval_expiry_date = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="verification_requests")
    beneficiary = relationship("Beneficiary", back_populates="verification_requests")
    admin_user = relationship("AdminUser", back_populates="verification_requests")
    documents = relationship("VerificationDocument", back_populates="request")
