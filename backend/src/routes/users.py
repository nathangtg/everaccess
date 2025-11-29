from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import connection
from ..schemas import user as user_schema
from ..dependencies import get_current_user
from ..database.models import user as user_model

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get("/me", response_model=user_schema.UserOut)
def read_users_me(current_user: user_model.User = Depends(get_current_user)):
    return current_user
