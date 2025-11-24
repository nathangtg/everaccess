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

class Subscription(Base):
    __tablename__ = "subscription"
    subscription_id = Column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id = Column(String(36), ForeignKey("users.user_id"))
    plan_type = Column(
        Enum("free", "premium", "partner", name="plan_type_enum"),
        default="free",
    )
    status = Column(
        Enum("active", "expired", "cancelled", "pending", name="sub_status_enum"),
        default="pending",
    )
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    payment_method_id = Column(String(255))
    auto_renew = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("User", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")
