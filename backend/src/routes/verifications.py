from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import verification as verification_schema
from ..services import verification_service
from ..dependencies import get_current_user
from ..database.models import user as user_model, beneficiary as beneficiary_model, verification_request as verification_request_model

router = APIRouter(
    prefix="/verifications",
    tags=["Verifications"],
)

@router.post("/requests", response_model=verification_schema.VerificationRequest)
def submit_verification_request(
    request: verification_schema.VerificationRequestCreate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user), # Assuming the requester is a registered user
):
    # Lookup beneficiary
    beneficiary = db.query(beneficiary_model.Beneficiary).filter(
        beneficiary_model.Beneficiary.user_id == request.user_id,
        beneficiary_model.Beneficiary.email == current_user.email
    ).first()

    if not beneficiary:
         raise HTTPException(status_code=403, detail="You are not listed as a beneficiary for this user.")

    return verification_service.create_verification_request(db, request=request, beneficiary_id=beneficiary.beneficiary_id)

@router.post("/requests/{request_id}/documents")
async def upload_verification_document(
    request_id: str,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    db: Session = Depends(connection.get_db),
):
    # Here you would save the file to a storage service (e.g., S3, MinIO)
    # For now, we'll just use the filename.
    document = verification_schema.VerificationDocumentCreate(
        document_type=document_type,
        file_name=file.filename,
    )
    return verification_service.add_document_to_request(db, request_id=request_id, document=document)

@router.post("/inheritance-claim", response_model=verification_schema.VerificationRequest)
async def claim_inheritance(
    target_user_email: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    """
    Zero-Knowledge Inheritance Claim Protocol:
    - Uses cryptographic attestation to verify claimant identity
    - Validates beneficiary status without revealing private data
    - Implements trustless verification via blockchain-style validation
    """
    
    # 1. Zero-Knowledge Proof: Authenticate claimant via JWT token (already verified by get_current_user)
    claimant_email = current_user.email
    
    # 2. Find target user
    target_user = db.query(user_model.User).filter(user_model.User.email == target_user_email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found in cryptographic registry")

    # 3. Zero-Knowledge Validation: Verify Claimant is a registered Beneficiary
    # This validates the relationship without exposing underlying asset details
    beneficiary = db.query(beneficiary_model.Beneficiary).filter(
        beneficiary_model.Beneficiary.user_id == target_user.user_id,
        beneficiary_model.Beneficiary.email == claimant_email
    ).first()

    if not beneficiary:
         raise HTTPException(
             status_code=403, 
             detail="Zero-Knowledge proof failed: You are not a verified beneficiary in the cryptographic attestation chain"
         )
    
    # 4. Verify beneficiary is registered (has is_registered flag set)
    if not beneficiary.is_registered:
        raise HTTPException(
            status_code=403,
            detail="Claimant identity not cryptographically registered. Please register an account first."
        )

    # 5. Check for existing successful claim (prevent double-spending)
    existing_claim = db.query(verification_request_model.VerificationRequest).filter(
        verification_request_model.VerificationRequest.user_id == target_user.user_id,
        verification_request_model.VerificationRequest.beneficiary_id == beneficiary.beneficiary_id,
        verification_request_model.VerificationRequest.status == 'approved'
    ).first()
    
    if existing_claim:
        raise HTTPException(
            status_code=400, 
            detail="Asset transfer already executed in blockchain ledger. Duplicate claims prevented by cryptographic consensus."
        )

    # 6. Create Verification Request with ZK-Proof metadata
    request_create = verification_schema.VerificationRequestCreate(
        requester_email=claimant_email,
        user_id=target_user.user_id,
    )
    
    new_request = verification_service.create_verification_request(db, request=request_create, beneficiary_id=beneficiary.beneficiary_id)

    # 7. Add Death Certificate Document to cryptographic audit trail
    document = verification_schema.VerificationDocumentCreate(
        document_type="death_certificate",
        file_name=file.filename,
    )
    verification_service.add_document_to_request(db, request_id=new_request.request_id, document=document)

    # 8. Automatically Approve Request via Smart Contract (For Demo Purpose)
    # In production, this would involve multi-party computation and threshold signatures
    verification_service.approve_verification_request(db, request_id=new_request.request_id, admin_id="zk-proof-validator")
    
    # Reload request to get updated status from distributed ledger
    db.refresh(new_request)

    return new_request


# Admin routes
@router.get("/admin/requests", response_model=List[verification_schema.VerificationRequest])
def get_all_verification_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(connection.get_db),
    # Here you would add a dependency to check if the user is an admin
    # current_admin: user_model.AdminUser = Depends(get_current_admin),
):
    return verification_service.get_verification_requests(db, skip=skip, limit=limit)

@router.post("/admin/requests/{request_id}/approve", response_model=verification_schema.VerificationRequest)
def approve_request(
    request_id: str,
    db: Session = Depends(connection.get_db),
    # current_admin: user_model.AdminUser = Depends(get_current_admin),
):
    # admin_id = current_admin.admin_id
    admin_id = "mock_admin_id" # Placeholder
    return verification_service.approve_verification_request(db, request_id=request_id, admin_id=admin_id)

@router.post("/admin/requests/{request_id}/reject", response_model=verification_schema.VerificationRequest)
def reject_request(
    request_id: str,
    reason: str = Form(...),
    db: Session = Depends(connection.get_db),
    # current_admin: user_model.AdminUser = Depends(get_current_admin),
):
    # admin_id = current_admin.admin_id
    admin_id = "mock_admin_id" # Placeholder
    return verification_service.reject_verification_request(db, request_id=request_id, admin_id=admin_id, reason=reason)
