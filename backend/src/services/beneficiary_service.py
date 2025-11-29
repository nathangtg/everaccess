import secrets
import hashlib
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database.models import beneficiary as beneficiary_model
from ..schemas import beneficiary as beneficiary_schema

def create_beneficiary(db: Session, beneficiary: beneficiary_schema.BeneficiaryCreate, user_id: str):
    db_beneficiary = beneficiary_model.Beneficiary(**beneficiary.dict(), user_id=user_id)
    db.add(db_beneficiary)
    db.commit()
    db.refresh(db_beneficiary)
    # Here you would typically send an email to the beneficiary.
    # For now, we'll just print to the console.
    print(f"Beneficiary {db_beneficiary.email} added for user {user_id}")
    return db_beneficiary

def get_beneficiaries(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(beneficiary_model.Beneficiary).filter(beneficiary_model.Beneficiary.user_id == user_id).offset(skip).limit(limit).all()

def get_beneficiary(db: Session, beneficiary_id: str, user_id: str):
    return db.query(beneficiary_model.Beneficiary).filter(beneficiary_model.Beneficiary.beneficiary_id == beneficiary_id, beneficiary_model.Beneficiary.user_id == user_id).first()

def delete_beneficiary(db: Session, beneficiary_id: str, user_id: str):
    db_beneficiary = db.query(beneficiary_model.Beneficiary).filter(beneficiary_model.Beneficiary.beneficiary_id == beneficiary_id, beneficiary_model.Beneficiary.user_id == user_id).first()
    if db_beneficiary:
        db.delete(db_beneficiary)
        db.commit()
    return db_beneficiary

def generate_access_token(db: Session, beneficiary_id: str) -> str:
    """
    Generates a secure access token for a beneficiary, stores the hash, and returns the raw token.
    """
    # 1. Generate a secure random token
    raw_token = secrets.token_urlsafe(32)
    
    # 2. Hash the token
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    
    # 3. Set expiry (e.g., 7 days)
    expiry = datetime.utcnow() + timedelta(days=7)
    
    # 4. Update Beneficiary record
    beneficiary = db.query(beneficiary_model.Beneficiary).filter(beneficiary_model.Beneficiary.beneficiary_id == beneficiary_id).first()
    if beneficiary:
        beneficiary.access_token_hash = token_hash
        beneficiary.token_expires_at = expiry
        db.add(beneficiary)
        db.commit()
        return raw_token
    return None

def verify_access_token(db: Session, raw_token: str):
    """
    Verifies a raw token against stored hashes and checks expiry.
    Returns the Beneficiary object if valid, else None.
    """
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    
    beneficiary = db.query(beneficiary_model.Beneficiary).filter(
        beneficiary_model.Beneficiary.access_token_hash == token_hash
    ).first()
    
    if beneficiary:
        # Check expiry
        if beneficiary.token_expires_at and beneficiary.token_expires_at > datetime.utcnow():
            return beneficiary
            
    return None
