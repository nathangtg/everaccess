import uuid
from sqlalchemy import (
    Column,
    Boolean,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class PartnerClient(Base):
    __tablename__ = "partner_clients"
    client_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    partner_id = Column(String(36), ForeignKey("partners.partner_id"))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    referral_date = Column(DateTime, server_default=func.now())
    commission_paid = Column(Boolean, default=False)

    partner = relationship("Partner", back_populates="partner_clients")
    user = relationship("User", back_populates="partner_clients")
