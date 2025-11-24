import uuid
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    ForeignKey,
    DECIMAL,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class Payment(Base):
    __tablename__ = "payments"
    payment_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"))
    subscription_id = Column(
        String(36), ForeignKey("subscription.subscription_id"), nullable=True
    )
    amount = Column(DECIMAL)
    currency = Column(String(3))
    payment_type = Column(
        Enum(
            "monthly_subscription",
            "guided_service",
            "partner_license",
            name="payment_type_enum",
        )
    )
    payment_status = Column(
        Enum("pending", "completed", "failed", "refunded", name="payment_status_enum"),
        default="pending",
    )
    payment_method = Column(
        Enum("credit_card", "paypal", "bank_transfer", name="payment_method_enum")
    )
    transaction_id = Column(String(255))
    payment_date = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="payments")
    subscription = relationship("Subscription", back_populates="payments")
