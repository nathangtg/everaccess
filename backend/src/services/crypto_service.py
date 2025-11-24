from sqlalchemy.orm import Session
from ..database.models import crypto_asset as crypto_asset_model, crypto_allocation as crypto_allocation_model, asset as asset_model
from ..schemas import crypto as crypto_schema
import uuid
from datetime import datetime

def create_crypto_asset(db: Session, crypto_asset: crypto_schema.CryptoAssetCreate, asset_id: str):
    db_crypto_asset = crypto_asset_model.CryptoAsset(**crypto_asset.dict(), crypto_asset_id=asset_id)
    db.add(db_crypto_asset)
    db.commit()
    db.refresh(db_crypto_asset)
    return db_crypto_asset

def create_crypto_allocation(db: Session, allocation: crypto_schema.CryptoAllocationCreate, crypto_asset_id: str):
    db_allocation = crypto_allocation_model.CryptoAllocation(**allocation.dict(), crypto_asset_id=crypto_asset_id)
    db.add(db_allocation)
    db.commit()
    db.refresh(db_allocation)
    return db_allocation

def get_crypto_asset(db: Session, crypto_asset_id: str, user_id: str):
    return db.query(crypto_asset_model.CryptoAsset).join(asset_model.Asset, crypto_asset_model.CryptoAsset.crypto_asset_id == asset_model.Asset.asset_id).filter(crypto_asset_model.CryptoAsset.crypto_asset_id == crypto_asset_id, asset_model.Asset.user_id == user_id).first()

def get_allocations_for_asset(db: Session, crypto_asset_id: str):
    return db.query(crypto_allocation_model.CryptoAllocation).filter(crypto_allocation_model.CryptoAllocation.crypto_asset_id == crypto_asset_id).all()

def calculate_crypto_distribution(db: Session, crypto_asset_id: str):
    """Calculate and generate mock disbursements"""
    asset = db.query(crypto_asset_model.CryptoAsset).filter(crypto_asset_model.CryptoAsset.crypto_asset_id == crypto_asset_id).first()
    if not asset:
        return None
        
    allocations = get_allocations_for_asset(db, crypto_asset_id)
    
    for allocation in allocations:
        allocation.allocated_amount_usd = asset.balance_usd * (allocation.percentage / 100)
        allocation.allocated_amount_crypto = asset.balance_crypto * (allocation.percentage / 100)
        allocation.mock_transaction_id = f"MOCK-{uuid.uuid4().hex[:16]}"
        allocation.disbursement_status = "disbursed"
        allocation.disbursed_at = datetime.now()
        db.add(allocation)
    
    db.commit()
    return allocations
