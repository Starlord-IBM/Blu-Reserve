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

@router.post("/", response_model=Booking)
def create_booking(booking: Booking, db=Depends(get_database)):
    booking_dict = booking.dict(exclude={"id"})
    booking_dict["created_at"] = datetime.utcnow()
    result = db.bookings.insert_one(booking_dict)
    created_booking = db.bookings.find_one({"_id": result.inserted_id})
    return created_booking