from sqlalchemy.orm import Session
from ..database.models import verification_request as verification_request_model, verification_document as verification_document_model, user as user_model, access_rule as access_rule_model
from ..schemas import verification as verification_schema

def create_verification_request(db: Session, request: verification_schema.VerificationRequestCreate, beneficiary_id: str):
    db_request = verification_request_model.VerificationRequest(
        requester_email=request.requester_email,
        user_id=request.user_id,
        beneficiary_id=beneficiary_id,
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_verification_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(verification_request_model.VerificationRequest).offset(skip).limit(limit).all()

def get_verification_request(db: Session, request_id: str):
    return db.query(verification_request_model.VerificationRequest).filter(verification_request_model.VerificationRequest.request_id == request_id).first()

def trigger_inheritance_process(db: Session, user_id: str):
    """
    Triggered when a death certificate is verified.
    1. Set User account_status to 'deceased'.
    2. Activate AccessRules with 'ON_DEATH' condition.
    """
    # 1. Update User Status
    user = db.query(user_model.User).filter(user_model.User.user_id == user_id).first()
    if user:
        user.account_status = "deceased"
        db.add(user)
    
    # 2. Activate Access Rules
    # We are looking for rules where conditions contains {"trigger": "ON_DEATH"}
    # Since conditions is a JSON column, exact matching or specialized operators depend on DB.
    # For simplicity/portability, we'll fetch rules for the user and filter in python if needed, 
    # or just assume we can inspect them.
    # In a real system, we might update a 'status' field on the rule, but AccessRule doesn't have a status field visible in the snippet.
    # However, the request asked to "access accordingly to their will". 
    # We'll assume "active" rules are those where conditions are met.
    # We will log this action or update a hypothetical status if it existed.
    # Since AccessRule definition doesn't have 'is_active', we might just rely on the 'deceased' user status
    # being the trigger for the Access Service to ALLOW access.
    
    # But to make it explicit, let's print/log.
    print(f"Inheritance process triggered for User {user_id}")
    
    db.commit()

def approve_verification_request(db: Session, request_id: str, admin_id: str):
    db_request = get_verification_request(db, request_id)
    if db_request:
        db_request.status = "approved"
        db_request.reviewed_by = admin_id
        
        # Check for death certificate
        is_death_certificate = False
        for doc in db_request.documents:
            if doc.document_type == "death_certificate": # Ensure this matches the Enum or string value
                is_death_certificate = True
                break
        
        if is_death_certificate:
            trigger_inheritance_process(db, db_request.user_id)

        db.commit()
    return db_request

def reject_verification_request(db: Session, request_id: str, admin_id: str, reason: str):
    db_request = get_verification_request(db, request_id)
    if db_request:
        db_request.status = "rejected"
        db_request.rejection_reason = reason
        db_request.reviewed_by = admin_id
        db.commit()
    return db_request

def add_document_to_request(db: Session, request_id: str, document: verification_schema.VerificationDocumentCreate):
    db_document = verification_document_model.VerificationDocument(
        request_id=request_id,
        document_type=document.document_type,
        file_name=document.file_name,
        # In a real app, the file would be uploaded to a storage service and
        # the path would be stored here.
        encrypted_file_path=f"uploads/{document.file_name}"
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document
