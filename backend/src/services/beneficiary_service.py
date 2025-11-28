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

def update_beneficiary(db: Session, beneficiary_id: str, beneficiary_update: beneficiary_schema.BeneficiaryUpdate, user_id: str):
    db_beneficiary = get_beneficiary(db, beneficiary_id, user_id)
    if not db_beneficiary:
        return None
    
    update_data = beneficiary_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_beneficiary, key, value)

    db.commit()
    db.refresh(db_beneficiary)
    return db_beneficiary

def delete_beneficiary(db: Session, beneficiary_id: str, user_id: str):
    db_beneficiary = db.query(beneficiary_model.Beneficiary).filter(beneficiary_model.Beneficiary.beneficiary_id == beneficiary_id, beneficiary_model.Beneficiary.user_id == user_id).first()
    if db_beneficiary:
        db.delete(db_beneficiary)
        db.commit()
    return db_beneficiary
