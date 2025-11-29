from sqlalchemy.orm import Session
from ..database.models import asset as asset_model, access_rule as access_rule_model
from ..database.models import asset as asset_model
from ..database.models.access_rule import AccessRule
from ..schemas import asset as asset_schema

def create_asset(db: Session, asset: asset_schema.AssetCreate, user_id: str):
    asset_data = asset.dict()
    beneficiary_ids = asset_data.pop("beneficiary_ids", [])

    db_asset = asset_model.Asset(**asset_data, user_id=user_id)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)

    if beneficiary_ids:
        for b_id in beneficiary_ids:
            access_rule = AccessRule(
                user_id=user_id,
                beneficiary_id=b_id,
                asset_id=db_asset.asset_id,
                access_type="full"
            )
            db.add(access_rule)
        db.commit()
        db.refresh(db_asset)

    return db_asset

def get_assets(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(asset_model.Asset).filter(asset_model.Asset.user_id == user_id).offset(skip).limit(limit).all()

def get_asset(db: Session, asset_id: str, user_id: str):
    return db.query(asset_model.Asset).filter(asset_model.Asset.asset_id == asset_id, asset_model.Asset.user_id == user_id).first()

def update_asset(db: Session, asset_id: str, asset_update: asset_schema.AssetUpdate, user_id: str):
    db_asset = get_asset(db, asset_id, user_id)
    if not db_asset:
        return None

    update_data = asset_update.dict(exclude_unset=True)
    beneficiary_ids = update_data.pop("beneficiary_ids", None)

    for key, value in update_data.items():
        setattr(db_asset, key, value)

    if beneficiary_ids is not None:
        # Remove existing access rules for this asset
        db.query(AccessRule).filter(AccessRule.asset_id == asset_id).delete()
        
        # Add new access rules
        for b_id in beneficiary_ids:
            access_rule = AccessRule(
                user_id=user_id,
                beneficiary_id=b_id,
                asset_id=asset_id,
                access_type="full"
            )
            db.add(access_rule)

    db.commit()
    db.refresh(db_asset)
    return db_asset

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
