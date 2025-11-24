import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    BigInteger,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class AssetFile(Base):
    __tablename__ = "asset_files"
    file_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_id = Column(String(36), ForeignKey("assets.asset_id"))
    file_name = Column(String(255))
    file_type = Column(String(255))
    file_size = Column(BigInteger)
    encrypted_file_path = Column(String(512))
    encryption_key_id = Column(String(255))
    uploaded_at = Column(DateTime, server_default=func.now())
    description = Column(Text)

    asset = relationship("Asset", back_populates="asset_files")
