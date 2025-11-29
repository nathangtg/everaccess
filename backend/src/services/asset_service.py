from sqlalchemy.orm import Session
from ..database.models import asset as asset_model, access_rule as access_rule_model
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

def get_assets_for_beneficiary(db: Session, beneficiary_id: str):
    """
    Retrieve assets accessible to a beneficiary via AccessRules.
    """
    # Join AccessRule and Asset
    results = db.query(asset_model.Asset).join(
        access_rule_model.AccessRule,
        access_rule_model.AccessRule.asset_id == asset_model.Asset.asset_id
    ).filter(
        access_rule_model.AccessRule.beneficiary_id == beneficiary_id
    ).all()
    
    return results
