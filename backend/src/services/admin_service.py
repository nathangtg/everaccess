from sqlalchemy.orm import Session
from ..database.models import user as user_model

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(user_model.User).offset(skip).limit(limit).all()

def get_user_by_id(db: Session, user_id: str):
    return db.query(user_model.User).filter(user_model.User.user_id == user_id).first()
