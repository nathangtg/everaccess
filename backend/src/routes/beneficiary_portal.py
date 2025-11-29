from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import asset as asset_schema
from ..services import asset_service, beneficiary_service

router = APIRouter(
    prefix="/beneficiary-portal",
    tags=["Beneficiary Portal"],
)

def get_authorized_beneficiary(
    token: str = Query(...),
    db: Session = Depends(connection.get_db)
):
    beneficiary = beneficiary_service.verify_access_token(db, token)
    if not beneficiary:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    return beneficiary

@router.get("/auth")
def verify_access(
    beneficiary = Depends(get_authorized_beneficiary)
):
    """
    Verifies the access token and returns beneficiary details.
    """
    return {
        "valid": True,
        "beneficiary_id": beneficiary.beneficiary_id,
        "first_name": beneficiary.first_name,
        "last_name": beneficiary.last_name
    }

@router.get("/assets", response_model=List[asset_schema.Asset])
def read_beneficiary_assets(
    db: Session = Depends(connection.get_db),
    beneficiary = Depends(get_authorized_beneficiary)
):
    """
    Returns assets released to this beneficiary.
    """
    return asset_service.get_assets_for_beneficiary(db, beneficiary.beneficiary_id)