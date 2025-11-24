from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import connection
from ..schemas import user as user_schema
from ..services import user_service
from ..utils import security

router = APIRouter(
    tags=["Authentication"],
)

@router.post("/register", response_model=user_schema.UserOut)
def register_user(user: user_schema.UserCreate, db: Session = Depends(connection.get_db)):
    db_user = user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_service.create_user(db=db, user=user)

@router.post("/login", response_model=user_schema.Token)
def login_for_access_token(form_data: user_schema.UserLogin, db: Session = Depends(connection.get_db)):
    user = user_service.get_user_by_email(db, email=form_data.email)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}
