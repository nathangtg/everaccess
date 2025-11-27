from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import connection
from ..schemas import asset as asset_schema
from ..services import asset_service
from ..dependencies import get_current_user
from ..database.models import user as user_model

router = APIRouter(
    prefix="/assets",
    tags=["Assets"],
)

@router.post("/", response_model=asset_schema.Asset)
def create_asset(
    asset: asset_schema.AssetCreate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    return asset_service.create_asset(db=db, asset=asset, user_id=current_user.user_id)

@router.get("/", response_model=List[asset_schema.Asset])
def read_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    assets = asset_service.get_assets(db, user_id=current_user.user_id, skip=skip, limit=limit)
    return assets

@router.get("/{asset_id}", response_model=asset_schema.Asset)
def read_asset(
    asset_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_asset = asset_service.get_asset(db, asset_id=asset_id, user_id=current_user.user_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_asset = asset_service.delete_asset(db, asset_id=asset_id, user_id=current_user.user_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    # For now, just return the filename.
    # In a real application, you would save the file to a storage service like S3 or MinIO
    # and store the file path in the database.
    return {"filename": file.filename}
