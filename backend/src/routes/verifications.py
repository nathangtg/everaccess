from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import verification as verification_schema
from ..services import verification_service
from ..routes.assets import get_current_user
from ..database.models import user as user_model

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
    # In a real scenario, the beneficiary might not be a registered user yet.
    # For simplicity, we assume the beneficiary is a user and can be authenticated.
    return verification_service.create_verification_request(db, request=request, beneficiary_id=current_user.user_id)

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
