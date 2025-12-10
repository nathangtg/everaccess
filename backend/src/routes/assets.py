from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid
from ..database import connection
from ..schemas import asset as asset_schema
from ..services import asset_service
from ..dependencies import get_current_user
from ..database.models import user as user_model

router = APIRouter(
    prefix="/assets",
    tags=["Assets"],
)

UPLOAD_DIR = "uploads"

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

@router.put("/{asset_id}", response_model=asset_schema.Asset)
def update_asset(
    asset_id: str,
    asset: asset_schema.AssetUpdate,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    db_asset = asset_service.update_asset(db, asset_id=asset_id, asset_update=asset, user_id=current_user.user_id)
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

@router.post("/{asset_id}/files/", response_model=asset_schema.AssetFile)
async def upload_asset_file(
    asset_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # Verify asset exists and belongs to user
    asset = asset_service.get_asset(db, asset_id=asset_id, user_id=current_user.user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Save file to disk
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    # Ensure directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata to DB
    asset_file = asset_service.add_file_to_asset(
        db=db,
        asset_id=asset_id,
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        file_size=os.path.getsize(file_path)
    )
    return asset_file

@router.get("/{asset_id}/files/{file_id}")
def download_asset_file(
    asset_id: str,
    file_id: str,
    db: Session = Depends(connection.get_db),
    current_user: user_model.User = Depends(get_current_user),
):
    # Verify asset exists and belongs to user
    asset = asset_service.get_asset(db, asset_id=asset_id, user_id=current_user.user_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    asset_file = asset_service.get_asset_file(db, asset_id=asset_id, file_id=file_id)
    if not asset_file:
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=asset_file.encrypted_file_path, 
        filename=asset_file.file_name,
        media_type=asset_file.file_type
    )
