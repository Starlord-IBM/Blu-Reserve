from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, bookings, seats
from .database import get_database, close_database, init_collections
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Blu Reserve API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(seats.router, prefix="/api/seats", tags=["seats"])

@app.on_event("startup")
def startup_event():
    try:
        db = get_database()
        init_collections()
        logger.info("Application startup: Database initialized successfully")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise e

@app.on_event("shutdown")
def shutdown_event():
    close_database()
    logger.info("Application shutdown: Closed database connection")

@app.get("/")
def root():
    return {"message": "Welcome to Blu Reserve API"}