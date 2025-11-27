from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.base import Base
from .database.connection import engine
from .routes import auth, assets, beneficiaries, crypto, verifications, beneficiary_portal, messages

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(assets.router)
app.include_router(beneficiaries.router)
app.include_router(crypto.router)
app.include_router(verifications.router)
app.include_router(beneficiary_portal.router)
app.include_router(messages.router)


def create_tables():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to EverAccess"}
