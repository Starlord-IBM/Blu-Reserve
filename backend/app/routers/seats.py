from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import get_database
from ..models import Seat
from bson import ObjectId

router = APIRouter()

@router.get("/{location_id}/{floor}", response_model=List[Seat])
def get_seats(
    location_id: str,
    floor: int,
    db=Depends(get_database)
):
    if not ObjectId.is_valid(location_id):
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    seats = list(db.seats.find({
        "location_id": location_id,
        "floor": floor
    }))
    return seats

@router.post("/", response_model=Seat)
def create_seat(seat: Seat, db=Depends(get_database)):
    seat_dict = seat.dict(exclude={"id"})
    result = db.seats.insert_one(seat_dict)
    created_seat = db.seats.find_one({"_id": result.inserted_id})
    return created_seat