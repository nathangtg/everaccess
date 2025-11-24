from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import beneficiary as beneficiary_schema
from ..services import beneficiary_service
from ..utils.security import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from ..services import user_service
from ..database.models import user as user_model
from ..routes.assets import get_current_user

router = APIRouter(
    prefix="/beneficiaries",
    tags=["Beneficiaries"],
)

@router.post("/", response_model=beneficiary_schema.Beneficiary)
def create_beneficiary(
    beneficiary: beneficiary_schema.BeneficiaryCreate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    return beneficiary_service.create_beneficiary(db=db, beneficiary=beneficiary, user_id=current_user.user_id)

@router.get("/", response_model=List[beneficiary_schema.Beneficiary])
def read_beneficiaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    beneficiaries = beneficiary_service.get_beneficiaries(db, user_id=current_user.user_id, skip=skip, limit=limit)
    return beneficiaries

@router.get("/{beneficiary_id}", response_model=beneficiary_schema.Beneficiary)
def read_beneficiary(
    beneficiary_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_beneficiary = beneficiary_service.get_beneficiary(db, beneficiary_id=beneficiary_id, user_id=current_user.user_id)
    if db_beneficiary is None:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return db_beneficiary

@router.delete("/{beneficiary_id}", response_model=beneficiary_schema.Beneficiary)
def delete_beneficiary(
    beneficiary_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_beneficiary = beneficiary_service.delete_beneficiary(db, beneficiary_id=beneficiary_id, user_id=current_user.user_id)
    if db_beneficiary is None:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return db_beneficiary
