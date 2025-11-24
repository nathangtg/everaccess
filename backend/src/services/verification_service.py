from sqlalchemy.orm import Session
from ..database.models import verification_request as verification_request_model, verification_document as verification_document_model
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

def approve_verification_request(db: Session, request_id: str, admin_id: str):
    db_request = get_verification_request(db, request_id)
    if db_request:
        db_request.status = "approved"
        db_request.reviewed_by = admin_id
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
