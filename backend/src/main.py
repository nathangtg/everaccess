from fastapi import FastAPI
from .database.base import Base
from .database.connection import engine
from .routes import auth, assets, beneficiaries, crypto, verifications, beneficiary_portal

app = FastAPI()

app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(beneficiaries.router)
app.include_router(crypto.router)
app.include_router(verifications.router)
app.include_router(beneficiary_portal.router)

# This function will create the database tables.
def create_tables():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to EverAccess"}
