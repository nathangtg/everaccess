from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from sqlalchemy.exc import OperationalError

from .database.base import Base
from .database.connection import engine
from .routes import auth, assets, beneficiaries, crypto, verifications, beneficiary_portal, messages, users

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router)
app.include_router(assets.router)
app.include_router(beneficiaries.router)
app.include_router(crypto.router)
app.include_router(verifications.router)
app.include_router(beneficiary_portal.router)
app.include_router(messages.router)


def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        # We don't raise here to allow the app to start even if DB is momentarily down,
        # though the healthcheck should catch it.

@app.on_event("startup")
async def startup_event():
    # Retry logic for DB connection
    max_retries = 5
    for i in range(max_retries):
        try:
            create_tables()
            break
        except OperationalError as e:
            logger.warning(f"Database not ready yet, retrying in 2 seconds... ({i+1}/{max_retries})")
            time.sleep(2)
        except Exception as e:
            logger.error(f"Unexpected error during startup: {e}")
            break

@app.get("/")
def read_root():
    return {"message": "Welcome to EverAccess"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
