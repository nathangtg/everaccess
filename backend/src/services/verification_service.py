from sqlalchemy.orm import Session
from ..database.models import verification_request as verification_request_model, verification_document as verification_document_model, user as user_model, access_rule as access_rule_model, beneficiary as beneficiary_model, asset as asset_model, crypto_asset as crypto_asset_model
from ..schemas import verification as verification_schema
from ..services import beneficiary_service, crypto_service

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
    2. Generate secure access tokens for all beneficiaries.
    3. Send notifications (emails) with the access link.
    4. Automatically disburse crypto assets.
    Returns: Dict[str, str] map of beneficiary_id -> raw_token
    """
    generated_tokens = {}
    # 1. Update User Status
    user = db.query(user_model.User).filter(user_model.User.user_id == user_id).first()
    if user:
        user.account_status = "deceased"
        db.add(user)
        
        print(f"Inheritance process triggered for User {user_id}")
        
        # 2. Generate Tokens for Beneficiaries
        beneficiaries = db.query(beneficiary_model.Beneficiary).filter(
            beneficiary_model.Beneficiary.user_id == user_id,
            beneficiary_model.Beneficiary.status == "active"
        ).all()
        
        for beneficiary in beneficiaries:
            raw_token = beneficiary_service.generate_access_token(db, beneficiary.beneficiary_id)
            generated_tokens[beneficiary.beneficiary_id] = raw_token
            
            # 3. Mock Send Email
            # In a real app, use an email service
            access_link = f"http://localhost:3000/dashboard/beneficiary-access?token={raw_token}"
            print(f"---------------------------------------------------")
            print(f"EMAIL TO: {beneficiary.email}")
            print(f"SUBJECT: Inheritance Access Granted")
            print(f"BODY: Dear {beneficiary.first_name}, access has been granted. Click here: {access_link}")
            print(f"---------------------------------------------------")
            
            beneficiary.notification_sent = True
            db.add(beneficiary)
        
        # 4. Auto-Distribute Crypto Assets
        crypto_assets = db.query(crypto_asset_model.CryptoAsset).join(asset_model.Asset).filter(asset_model.Asset.user_id == user_id).all()
        for crypto_asset in crypto_assets:
            print(f"Distributing Crypto Asset: {crypto_asset.crypto_asset_id}")
            crypto_service.calculate_crypto_distribution(db, crypto_asset.crypto_asset_id)
            
        db.commit()
    return generated_tokens

def approve_verification_request(db: Session, request_id: str, admin_id: str):
    db_request = get_verification_request(db, request_id)
    tokens = {}
    if db_request:
        db_request.status = "approved"
        # Only assign reviewed_by if it's a real admin ID (UUID format usually), 
        # or handle the system case. For now, if it's "auto-system-approval", leave it None 
        # to avoid FK constraint error since that ID doesn't exist in admin_users table.
        if admin_id and admin_id != "auto-system-approval":
            db_request.reviewed_by = admin_id
        
        # Check for death certificate
        is_death_certificate = False
        for doc in db_request.documents:
            if doc.document_type == "death_certificate": # Ensure this matches the Enum or string value
                is_death_certificate = True
                break
        
        if is_death_certificate:
            tokens = trigger_inheritance_process(db, db_request.user_id)

        db.commit()
    return {"request": db_request, "tokens": tokens}

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
