from sqlalchemy.orm import Session
from ..database.models import asset as asset_model
from ..schemas import asset as asset_schema

def create_asset(db: Session, asset: asset_schema.AssetCreate, user_id: str):
    db_asset = asset_model.Asset(**asset.dict(), user_id=user_id)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def get_assets(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(asset_model.Asset).filter(asset_model.Asset.user_id == user_id).offset(skip).limit(limit).all()

def get_asset(db: Session, asset_id: str, user_id: str):
    return db.query(asset_model.Asset).filter(asset_model.Asset.asset_id == asset_id, asset_model.Asset.user_id == user_id).first()

def delete_asset(db: Session, asset_id: str, user_id: str):
    db_asset = db.query(asset_model.Asset).filter(asset_model.Asset.asset_id == asset_id, asset_model.Asset.user_id == user_id).first()
    if db_asset:
        db.delete(db_asset)
        db.commit()
    return db_asset
