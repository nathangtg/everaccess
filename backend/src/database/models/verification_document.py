import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class VerificationDocument(Base):
    __tablename__ = "verification_documents"
    document_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(
        String(36), ForeignKey("verification_requests.request_id")
    )
    document_type = Column(
        Enum(
            "death_certificate",
            "government_id",
            "legal_authorization",
            "other",
            name="doc_type_enum",
        )
    )
    file_name = Column(String(255))
    encrypted_file_path = Column(String(512))
    uploaded_at = Column(DateTime, server_default=func.now())
    verified = Column(Boolean, default=False)

    request = relationship("VerificationRequest", back_populates="documents")
