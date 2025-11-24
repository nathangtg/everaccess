import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    DECIMAL,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class Partner(Base):
    __tablename__ = "partners"
    partner_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(String(255), nullable=False)
    contact_email = Column(String(255))
    contact_phone = Column(String(255))
    license_type = Column(String(255))
    license_start_date = Column(DateTime)
    license_end_date = Column(DateTime)
    annual_fee = Column(DECIMAL)
    status = Column(
        Enum("active", "suspended", "expired", name="partner_status_enum"),
        default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    partner_clients = relationship("PartnerClient", back_populates="partner")
