import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class AdminUser(Base):
    __tablename__ = "admin_users"
    admin_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(512), nullable=False)
    first_name = Column(String(255))
    last_name = Column(String(255))
    role = Column(Enum("super_admin", "support", "verifier", name="admin_role_enum"))
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime)
    status = Column(
        Enum("active", "inactive", name="admin_status_enum"), default="active"
    )

    verification_requests = relationship(
        "VerificationRequest", back_populates="admin_user"
    )
