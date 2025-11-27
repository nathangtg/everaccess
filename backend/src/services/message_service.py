from sqlalchemy.orm import Session
from ..database.models import user_message as message_model
from ..schemas import user_message as message_schema
import uuid

def create_message(db: Session, message: message_schema.UserMessageCreate, user_id: str):
    db_message = message_model.UserMessage(
        **message.dict(),
        user_id=user_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_user_messages(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(message_model.UserMessage).filter(message_model.UserMessage.user_id == user_id).offset(skip).limit(limit).all()

def get_message(db: Session, message_id: str, user_id: str):
    return db.query(message_model.UserMessage).filter(message_model.UserMessage.message_id == message_id, message_model.UserMessage.user_id == user_id).first()

def delete_message(db: Session, message_id: str, user_id: str):
    db_message = get_message(db, message_id, user_id)
    if db_message:
        db.delete(db_message)
        db.commit()
    return db_message
