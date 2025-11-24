import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class EncryptionKey(Base):
    __tablename__ = "encryption_keys"
    key_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    key_hash = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    rotated_at = Column(DateTime, nullable=True)
    status = Column(
        Enum("active", "rotated", "revoked", name="key_status_enum"),
        default="active",
    )

    user = relationship("User", back_populates="encryption_keys")
