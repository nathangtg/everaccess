from sqlalchemy.orm import Session
from ..database.models import user as user_model
from ..schemas import user as user_schema
from ..utils.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(user_model.User).filter(user_model.User.email == email).first()

def create_user(db: Session, user: user_schema.UserCreate):
    hashed_password = get_password_hash(user.password)
    
    db_user = user_model.User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
