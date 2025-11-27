from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import crypto as crypto_schema, asset as asset_schema
from ..services import crypto_service, asset_service
from ..dependencies import get_current_user
from ..database.models import user as user_model

router = APIRouter(
    prefix="/crypto",
    tags=["Crypto"],
)

@router.post("/assets", response_model=crypto_schema.CryptoAsset)
def create_crypto_asset(
    crypto_asset: crypto_schema.CryptoAssetCreate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # First, create a generic asset
    asset = asset_schema.AssetCreate(
        asset_type="crypto_wallet",
        asset_name=f"{crypto_asset.wallet_type} Wallet",
    )
    db_asset = asset_service.create_asset(db=db, asset=asset, user_id=current_user.user_id)

    # Then, create the crypto asset details
    db_crypto_asset = crypto_service.create_crypto_asset(
        db=db, crypto_asset=crypto_asset, asset_id=db_asset.asset_id
    )
    return db_crypto_asset


@router.get("/assets/{asset_id}", response_model=crypto_schema.CryptoAsset)
def read_crypto_asset(
    asset_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_crypto_asset = crypto_service.get_crypto_asset(db, crypto_asset_id=asset_id, user_id=current_user.user_id)
    if db_crypto_asset is None:
        raise HTTPException(status_code=404, detail="Crypto asset not found")
    return db_crypto_asset


@router.post("/assets/{asset_id}/allocations", response_model=crypto_schema.CryptoAllocation)
def create_allocation_for_asset(
    asset_id: str,
    allocation: crypto_schema.CryptoAllocationCreate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # Ensure the user owns the crypto asset
    db_crypto_asset = crypto_service.get_crypto_asset(db, crypto_asset_id=asset_id, user_id=current_user.user_id)
    if db_crypto_asset is None:
        raise HTTPException(status_code=404, detail="Crypto asset not found")

    return crypto_service.create_crypto_allocation(
        db=db, allocation=allocation, crypto_asset_id=asset_id
    )

@router.get("/assets/{asset_id}/allocations", response_model=List[crypto_schema.CryptoAllocation])
def read_allocations_for_asset(
    asset_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # Ensure the user owns the crypto asset
    db_crypto_asset = crypto_service.get_crypto_asset(db, crypto_asset_id=asset_id, user_id=current_user.user_id)
    if db_crypto_asset is None:
        raise HTTPException(status_code=404, detail="Crypto asset not found")

    return crypto_service.get_allocations_for_asset(db, crypto_asset_id=asset_id)


@router.post("/assets/{asset_id}/disburse")
def disburse_crypto_asset(
    asset_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # Ensure the user owns the crypto asset
    db_crypto_asset = crypto_service.get_crypto_asset(db, crypto_asset_id=asset_id, user_id=current_user.user_id)
    if db_crypto_asset is None:
        raise HTTPException(status_code=404, detail="Crypto asset not found")

    return crypto_service.calculate_crypto_distribution(db, crypto_asset_id=asset_id)
