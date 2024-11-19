from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from app.database import connect_to_mongodb, close_mongodb_connection
from app.routers import locations, seats, bookings, timeslots

app = FastAPI(
    title="Blu-Reserve API",
    description="API for Blu-Reserve Cafeteria Seat Booking System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and shutdown events
@app.on_event("startup")
def startup_event():
    try:
        connect_to_mongodb()
    except Exception as e:
        print(f"Error during startup: {e}")
        raise e

@app.on_event("shutdown")
def shutdown_event():
    close_mongodb_connection()

# Include routers
app.include_router(
    locations.router,
    prefix="/api/locations",
    tags=["locations"]
)

app.include_router(
    seats.router,
    prefix="/api/seats",
    tags=["seats"]
)

app.include_router(
    bookings.router,
    prefix="/api/bookings",
    tags=["bookings"]
)
app.include_router(timeslots.router, prefix="/api/timeslots", tags=["timeslots"])

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to Blu-Reserve API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )