from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import connection
from ..schemas import admin as admin_schema, user as user_schema
from ..services import admin_service, user_service
from ..routes.assets import get_current_user 
from ..database.models import user as user_model

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

# A mock dependency to ensure the user is an admin.
def get_current_admin(current_user: user_model.User = Depends(get_current_user)):
    # For now, we assume any logged-in user is an admin for prototyping.
    # In a real application, you would check current_user.role or similar.
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin")
    return current_user

@router.get("/users", response_model=List[admin_schema.UserAdminView])
async def get_all_users_admin(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(connection.get_db),
    current_admin: user_model.User = Depends(get_current_admin),
):
    users = admin_service.get_all_users(db, skip=skip, limit=limit)
    return users

@router.get("/users/{user_id}", response_model=admin_schema.UserAdminView)
async def get_user_by_id_admin(
    user_id: str,
    db: Session = Depends(connection.get_db),
    current_admin: user_model.User = Depends(get_current_admin),
):
    user = admin_service.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
