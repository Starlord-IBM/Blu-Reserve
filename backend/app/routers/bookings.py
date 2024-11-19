from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import get_database
from ..models import Booking
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/{location_id}", response_model=List[Booking])
def get_bookings(
    location_id: str,
    db=Depends(get_database)
):
    if not ObjectId.is_valid(location_id):
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    bookings = list(db.bookings.find({
        "location_id": location_id
    }))
    return bookings

@router.post("/")
async def create_booking(booking: Booking, db=Depends(get_database)):
    try:
        # Validate booking time is in the future
        if booking.time_slot.start_time <= datetime.now():
            raise HTTPException(
                status_code=400, 
                detail="Booking time must be in the future"
            )

        # Convert booking data to dict for MongoDB
        booking_dict = booking.model_dump(exclude={"id"})
        
        # Insert booking
        result = db.bookings.insert_one(booking_dict)
        
        # Return created booking
        created_booking = db.bookings.find_one({"_id": result.inserted_id})
        return Booking(**created_booking)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))