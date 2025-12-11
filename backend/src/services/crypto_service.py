from sqlalchemy.orm import Session
from ..database.models import crypto_asset as crypto_asset_model, crypto_allocation as crypto_allocation_model, asset as asset_model, user as user_model, beneficiary as beneficiary_model
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
    from decimal import Decimal
    # Get the associated crypto asset to calculate amounts based on percentage
    crypto_asset = db.query(crypto_asset_model.CryptoAsset).filter(
        crypto_asset_model.CryptoAsset.crypto_asset_id == crypto_asset_id
    ).first()

    if not crypto_asset:
        raise ValueError(f"Crypto asset with id {crypto_asset_id} not found")

    try:
        # Calculate allocated amounts based on the percentage, ensuring Decimal types
        # Handle the case where balances might be None
        balance_usd = crypto_asset.balance_usd or Decimal('0')
        balance_crypto = crypto_asset.balance_crypto or Decimal('0')

        allocated_amount_usd = balance_usd * allocation.percentage / Decimal('100')
        allocated_amount_crypto = balance_crypto * allocation.percentage / Decimal('100')
    except Exception as e:
        raise ValueError(f"Error calculating allocation amounts: {str(e)}")

    # Create the allocation with explicitly set values
    db_allocation = crypto_allocation_model.CryptoAllocation(
        beneficiary_id=allocation.beneficiary_id,
        percentage=allocation.percentage,
        crypto_asset_id=crypto_asset_id,
        allocated_amount_usd=allocated_amount_usd,
        allocated_amount_crypto=allocated_amount_crypto,
        disbursement_status="pending",  # Default to pending upon creation
        mock_transaction_id=None  # Will be generated when disbursed
    )
    db.add(db_allocation)
    db.commit()
    db.refresh(db_allocation)

    # Ensure the returned object has proper values
    # Sometimes the refresh might not populate values correctly due to SQLAlchemy mapping
    if db_allocation.allocated_amount_usd is None:
        db_allocation.allocated_amount_usd = allocated_amount_usd
    if db_allocation.allocated_amount_crypto is None:
        db_allocation.allocated_amount_crypto = allocated_amount_crypto
    if db_allocation.disbursement_status is None:
        db_allocation.disbursement_status = "pending"

    return db_allocation

def get_crypto_asset(db: Session, crypto_asset_id: str, user_id: str):
    return db.query(crypto_asset_model.CryptoAsset).join(asset_model.Asset, crypto_asset_model.CryptoAsset.crypto_asset_id == asset_model.Asset.asset_id).filter(crypto_asset_model.CryptoAsset.crypto_asset_id == crypto_asset_id, asset_model.Asset.user_id == user_id).first()

def get_allocations_for_asset(db: Session, crypto_asset_id: str):
    return db.query(crypto_allocation_model.CryptoAllocation).filter(crypto_allocation_model.CryptoAllocation.crypto_asset_id == crypto_asset_id).all()

def calculate_crypto_distribution(db: Session, crypto_asset_id: str):
    """Calculate and generate mock disbursements"""
    # 1. Fetch the original Asset and CryptoAsset
    original_crypto_asset = db.query(crypto_asset_model.CryptoAsset).filter(crypto_asset_model.CryptoAsset.crypto_asset_id == crypto_asset_id).first()
    if not original_crypto_asset:
        return None
    
    original_asset = db.query(asset_model.Asset).filter(asset_model.Asset.asset_id == crypto_asset_id).first()
    if not original_asset:
        return None

    allocations = get_allocations_for_asset(db, crypto_asset_id)

    for allocation in allocations:
        # Calculate amounts
        allocation.allocated_amount_usd = original_crypto_asset.balance_usd * (allocation.percentage / 100)
        allocation.allocated_amount_crypto = original_crypto_asset.balance_crypto * (allocation.percentage / 100)
        allocation.mock_transaction_id = f"MOCK-{uuid.uuid4().hex[:16]}"
        allocation.disbursement_status = "disbursed"
        allocation.disbursed_at = datetime.now()
        db.add(allocation)
        
        # Simulate Decryption and Disbursement
        print(f"---------------------------------------------------")
        print(f"DISBURSING CRYPTO ASSET: {original_crypto_asset.asset_name}")
        print(f"Beneficiary: {allocation.beneficiary_id}")
        print(f"Amount: {allocation.allocated_amount_crypto} {original_crypto_asset.wallet_type.upper()}")
        print(f"Decrypting Private Key: {original_crypto_asset.private_key} using ZK-Proof derived key...")
        print(f"Unlocking Wallet: {original_crypto_asset.wallet_address}")
        print(f"Broadcasting Transaction: {allocation.mock_transaction_id}")
        print(f"Status: CONFIRMED")
        print(f"---------------------------------------------------")
        
        # ------------------------------------------------------------------
        # NEW: Clone Asset to Beneficiary's Account
        # ------------------------------------------------------------------
        # Find the beneficiary record to get the email
        beneficiary = db.query(beneficiary_model.Beneficiary).filter(
            beneficiary_model.Beneficiary.beneficiary_id == allocation.beneficiary_id
        ).first()
        
        if beneficiary and beneficiary.email:
            # Check if this beneficiary has a registered User account
            beneficiary_user = db.query(user_model.User).filter(
                user_model.User.email == beneficiary.email
            ).first()
            
            if beneficiary_user:
                print(f"Creating inherited asset for User {beneficiary_user.email} from allocation {allocation.allocation_id}")
                
                # 1. Create new Asset record
                new_asset = asset_model.Asset(
                    user_id=beneficiary_user.user_id,
                    asset_type=original_asset.asset_type,
                    platform_name=original_asset.platform_name,
                    asset_name=f"{original_asset.asset_name} (Inherited)",
                    category="Inherited Assets",
                    username=original_asset.username,
                    # In a real app, you might re-encrypt these or share the key
                    password=original_asset.password,
                    recovery_email=original_asset.recovery_email,
                    notes=f"Inherited from {original_asset.user.first_name} {original_asset.user.last_name}. " + (original_asset.notes or "")
                )
                db.add(new_asset)
                db.flush() # get new_asset.asset_id
                
                # 2. Create new CryptoAsset record with allocated balance
                new_crypto_asset = crypto_asset_model.CryptoAsset(
                    crypto_asset_id=new_asset.asset_id,
                    wallet_type=original_crypto_asset.wallet_type,
                    wallet_address=original_crypto_asset.wallet_address,
                    # Set balance to the allocated amount
                    balance_usd=allocation.allocated_amount_usd,
                    balance_crypto=allocation.allocated_amount_crypto,
                    private_key=original_crypto_asset.private_key, # In real app, consider security implications
                    seed_phrase=original_crypto_asset.seed_phrase
                )
                db.add(new_crypto_asset)

    db.commit()
    return allocations
