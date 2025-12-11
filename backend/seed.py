import os
import sys
from decimal import Decimal
from datetime import datetime, timedelta

# Add src to the system path to allow imports
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from sqlalchemy.orm import Session
from src.database.connection import engine, SessionLocal
from src.database.base import Base
from src.database.models import User, Beneficiary, Asset, CryptoAsset, CryptoAllocation, AdminUser
from src.utils.security import get_password_hash

def seed_data():
    # Create tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Check if user already exists to avoid duplicate entries if run multiple times
        existing_user = db.query(User).filter(User.email == "demo@everaccess.com").first()
        if existing_user:
            print("Demo user already exists. Cleaning up old data...")
            # For this strict demo script, let's drop all and recreate to ensure clean state.
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            print("Tables recreated.")

        print("Seeding data...")

        # 1. Create User
        user = User(
            email="demo@everaccess.com",
            password_hash=get_password_hash("password123"),
            first_name="Nathan",
            last_name="Demo",
            phone_number="+15550199",
            date_of_birth=datetime(1985, 5, 15),
            account_status="active",
            email_verified=True,
            mfa_enabled=True
        )
        db.add(user)
        db.flush() # Flush to get user.user_id


        # 1.5 Create Alice User (Beneficiary)
        alice_user = User(
            email="alice@example.com",
            password_hash=get_password_hash("password123"),
            first_name="Alice",
            last_name="Demo",
            phone_number="+15550200",
            date_of_birth=datetime(1990, 8, 20),
            account_status="active",
            email_verified=True,
            mfa_enabled=False
        )
        db.add(alice_user)
        db.flush()

        # 1.6 Create ZK Proof Validator Admin (System User)
        zk_admin = AdminUser(
            admin_id="zk-proof-validator",
            email="zk-validator@everaccess.system",
            password_hash=get_password_hash("system_password_secure_hash"),
            first_name="ZK",
            last_name="Validator",
            role="verifier"
        )
        db.add(zk_admin)
        db.flush()

        # 2. Create Multiple Beneficiaries
        beneficiaries_data = [
            {
                "email": "alice@example.com",
                "first_name": "Alice",
                "last_name": "Demo",
                "relationship_type": "Spouse",
                "priority_level": 1
            },
            {
                "email": "bob@example.com",
                "first_name": "Bob",
                "last_name": "Demo",
                "relationship_type": "Brother",
                "priority_level": 2
            },
            {
                "email": "charlie@example.com",
                "first_name": "Charlie",
                "last_name": "Demo",
                "relationship_type": "Business Partner",
                "priority_level": 3
            },
            {
                "email": "diana@example.com",
                "first_name": "Diana",
                "last_name": "Demo",
                "relationship_type": "Daughter",
                "priority_level": 1
            },
            {
                "email": "eve@example.com",
                "first_name": "Eve",
                "last_name": "Demo",
                "relationship_type": "Trusted Friend",
                "priority_level": 4
            }
        ]

        beneficiaries = []
        for beneficiary_data in beneficiaries_data:
            is_alice = beneficiary_data["email"] == "alice@example.com"
            beneficiary = Beneficiary(
                user_id=user.user_id,
                email=beneficiary_data["email"],
                first_name=beneficiary_data["first_name"],
                last_name=beneficiary_data["last_name"],
                relationship_type=beneficiary_data["relationship_type"],
                priority_level=beneficiary_data["priority_level"],
                status="active",
                is_registered=is_alice
            )
            db.add(beneficiary)
            beneficiaries.append(beneficiary)
        db.flush() # Flush to get beneficiary IDs

        # 3. Create Various Assets
        assets_data = [
            # Crypto Assets
            {
                "type": "crypto_wallet",
                "platform": "Bitcoin",
                "name": "Bitcoin Cold Storage",
                "balance_usd": Decimal('250000.00'),
                "balance_crypto": Decimal('3.5'),
                "wallet_type": "bitcoin",
                "wallet_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                "notes": "Stored in safe deposit box #402"
            },
            {
                "type": "crypto_wallet",
                "platform": "Ethereum",
                "name": "Ethereum Hot Wallet",
                "balance_usd": Decimal('85000.00'),
                "balance_crypto": Decimal('120.5'),
                "wallet_type": "ethereum",
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "notes": "For everyday transactions"
            },
            {
                "type": "crypto_wallet",
                "platform": "Tether",
                "name": "Tether Stablecoin Wallet",
                "balance_usd": Decimal('45000.00'),
                "balance_crypto": Decimal('45000.0'),
                "wallet_type": "usdt",
                "wallet_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb",
                "notes": "Stablecoin reserves"
            },
            {
                "type": "crypto_wallet",
                "platform": "Solana",
                "name": "Solana Staking Wallet",
                "balance_usd": Decimal('12500.00'),
                "balance_crypto": Decimal('150.0'),
                "wallet_type": "solana",
                "wallet_address": "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
                "notes": "Long-term staking"
            },
            # Financial Accounts
            {
                "type": "financial",
                "platform": "Bank of America",
                "name": "Primary Checking Account",
                "username": "nathan.demo",
                "password": "encrypted_banking_password",
                "recovery_email": "nathan.backup@gmail.com",
                "category": "Banking"
            },
            {
                "type": "financial",
                "platform": "Chase",
                "name": "Savings Account",
                "username": "nathan_demo_savings",
                "password": "encrypted_chase_password",
                "category": "Banking"
            },
            {
                "type": "financial",
                "platform": "Fidelity",
                "name": "Investment Portfolio",
                "username": "nathan_demo_invest",
                "password": "encrypted_fidelity_password",
                "category": "Investments"
            },
            {
                "type": "financial",
                "platform": "E-Trade",
                "name": "Stock Trading Account",
                "username": "nathan.stocks",
                "password": "encrypted_etrade_password",
                "category": "Investments"
            },
            {
                "type": "financial",
                "platform": "Coinbase",
                "name": "Exchange Account",
                "username": "nathan.crypto",
                "password": "encrypted_coinbase_password",
                "category": "Investments"
            },
            # Login Credentials
            {
                "type": "login_credential",
                "platform": "Google",
                "name": "Primary Gmail Account",
                "username": "nathan.demo@gmail.com",
                "password": "encrypted_google_password",
                "category": "Email"
            },
            {
                "type": "login_credential",
                "platform": "Apple",
                "name": "Apple ID Account",
                "username": "nathan.demo@apple.com",
                "password": "encrypted_apple_password",
                "category": "Technology"
            },
            {
                "type": "login_credential",
                "platform": "Cloudflare",
                "name": "Domain Management",
                "username": "nathan@domain.com",
                "password": "encrypted_cloud_password",
                "category": "Infrastructure"
            },
            {
                "type": "login_credential",
                "platform": "Dropbox",
                "name": "Cloud Storage Archive",
                "username": "nathan.files@gmail.com",
                "password": "encrypted_dropbox_password",
                "category": "Infrastructure"
            },
            # Social Media
            {
                "type": "social_media",
                "platform": "Twitter",
                "name": "Professional Twitter",
                "username": "nathandemo",
                "password": "encrypted_twitter_password",
                "category": "Social Media"
            },
            {
                "type": "social_media",
                "platform": "LinkedIn",
                "name": "LinkedIn Professional",
                "username": "nathan-demo",
                "password": "encrypted_linkedin_password",
                "category": "Social Media"
            },
            # Documents
            {
                "type": "document",
                "platform": "Legal",
                "name": "Estate Planning Documents",
                "notes": "Will, Trust Documents, Power of Attorney",
                "category": "Legal"
            },
            {
                "type": "document",
                "platform": "Tax",
                "name": "Tax Returns Archive",
                "notes": "Tax returns from 2020-2023",
                "category": "Financial"
            },
            {
                "type": "document",
                "platform": "Insurance",
                "name": "Insurance Policies",
                "notes": "Life, Health, Property Insurance Documents",
                "category": "Insurance"
            }
        ]

        # Create assets and crypto assets
        for asset_data in assets_data:
            asset = Asset(
                user_id=user.user_id,
                asset_type=asset_data["type"],
                platform_name=asset_data["platform"],
                asset_name=asset_data["name"],
                category=asset_data.get("category", "General"),
                username=asset_data.get("username"),
                password=asset_data.get("password"),
                recovery_email=asset_data.get("recovery_email"),
                notes=asset_data.get("notes", "")
            )
            db.add(asset)
            db.flush()  # Flush to get asset_id

            # If it's a crypto asset, create the CryptoAsset record
            if asset_data["type"] == "crypto_wallet":
                crypto_asset = CryptoAsset(
                    crypto_asset_id=asset.asset_id,
                    wallet_type=asset_data["wallet_type"],
                    wallet_address=asset_data["wallet_address"],
                    balance_usd=asset_data["balance_usd"],
                    balance_crypto=asset_data["balance_crypto"],
                    private_key=f"encrypted_private_key_{asset.asset_id[:8]}",  # Simulated encrypted data
                    seed_phrase=f"encrypted_seed_phrase_{asset.asset_id[:8]}"
                )
                db.add(crypto_asset)

        # Create some allocation examples to demonstrate the functionality
        # First, let's commit the initial data and then create allocations
        db.commit()

        # Now fetch the created assets to create allocations
        crypto_assets = db.query(CryptoAsset).join(Asset).filter(Asset.user_id == user.user_id).all()
        beneficiaries = db.query(Beneficiary).filter(Beneficiary.user_id == user.user_id).all()

        # Create some example allocations
        allocation_examples = [
            # Alice gets 40% of Bitcoin wallet
            {"beneficiary_id": beneficiaries[0].beneficiary_id, "crypto_asset_id": crypto_assets[0].crypto_asset_id, "percentage": Decimal('40.0')},
            # Bob gets 20% of Bitcoin wallet
            {"beneficiary_id": beneficiaries[1].beneficiary_id, "crypto_asset_id": crypto_assets[0].crypto_asset_id, "percentage": Decimal('20.0')},
            # Diana gets 25% of Ethereum wallet
            {"beneficiary_id": beneficiaries[3].beneficiary_id, "crypto_asset_id": crypto_assets[1].crypto_asset_id, "percentage": Decimal('25.0')},
            # Charlie gets 15% of Ethereum wallet
            {"beneficiary_id": beneficiaries[2].beneficiary_id, "crypto_asset_id": crypto_assets[1].crypto_asset_id, "percentage": Decimal('15.0')},
            # Eve gets 30% of Solana wallet
            {"beneficiary_id": beneficiaries[4].beneficiary_id, "crypto_asset_id": crypto_assets[2].crypto_asset_id, "percentage": Decimal('30.0')},
            # Alice gets 20% of Solana wallet
            {"beneficiary_id": beneficiaries[0].beneficiary_id, "crypto_asset_id": crypto_assets[2].crypto_asset_id, "percentage": Decimal('20.0')}
        ]

        for alloc_data in allocation_examples:
            allocation = CryptoAllocation(
                beneficiary_id=alloc_data["beneficiary_id"],
                crypto_asset_id=alloc_data["crypto_asset_id"],
                percentage=alloc_data["percentage"],
                allocated_amount_usd=Decimal('0.0'),  # Will be calculated when disbursement occurs
                allocated_amount_crypto=Decimal('0.0'),  # Will be calculated when disbursement occurs
                disbursement_status="pending",  # Default to pending
                mock_transaction_id=None  # Will be generated when disbursed
            )
            db.add(allocation)

        db.commit()

        print("Data seeded successfully!")
        print(f"User ID: {user.user_id}")
        print(f"Created {len(beneficiaries)} beneficiaries")
        print(f"Created {len(assets_data)} assets ({sum(1 for a in assets_data if a['type'] == 'crypto_wallet')} crypto wallets)")
        print(f"Created {len(allocation_examples)} crypto allocations")
        print("Login as Benefactor: demo@everaccess.com / password123")
        print("Login as Beneficiary: alice@example.com / password123")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()