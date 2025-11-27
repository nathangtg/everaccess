from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import user_message as message_schema
from ..services import message_service
from ..utils import security
from ..database.models.user import User

router = APIRouter(
    prefix="/messages",
    tags=["Time Capsule Messages"],
)

def get_current_user(token: str = Depends(security.oauth2_scheme), db: Session = Depends(connection.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = security.decode_access_token(token)
    if email is None:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=message_schema.UserMessage)
def create_message(
    message: message_schema.UserMessageCreate,
    db: Session = Depends(connection.get_db),
    current_user: User = Depends(get_current_user)
):
    return message_service.create_message(db=db, message=message, user_id=current_user.user_id)

@router.get("/", response_model=List[message_schema.UserMessage])
def read_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(connection.get_db),
    current_user: User = Depends(get_current_user)
):
    return message_service.get_user_messages(db=db, user_id=current_user.user_id, skip=skip, limit=limit)

@router.delete("/{message_id}", response_model=message_schema.UserMessage)
def delete_message(
    message_id: str,
    db: Session = Depends(connection.get_db),
    current_user: User = Depends(get_current_user)
):
    db_message = message_service.delete_message(db=db, message_id=message_id, user_id=current_user.user_id)
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_message
