from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_database
from datetime import datetime, timedelta
from bson import ObjectId
from ..auth import get_current_user
import pytz
from fastapi.params import Query
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
IST = pytz.timezone('Asia/Kolkata')

@router.get("/available")
async def get_available_seats(
    booking_date: datetime = Query(...),
    duration_minutes: int = Query(...),
    db = Depends(get_database)
):
    try:
        # Convert string datetime to IST
        if booking_date.tzinfo is None:
            booking_start = pytz.utc.localize(booking_date)
        else:
            booking_start = booking_date
            
        booking_start = booking_start.astimezone(IST)
        booking_end = booking_start + timedelta(minutes=duration_minutes)

        logger.info(f"Checking availability for: {booking_start} to {booking_end}")

        # Get all seats first
        all_seats = list(db.seats.find({}))

        # Find all active bookings that overlap with the requested time
        conflicting_bookings = list(db.bookings.find({
            "status": "active",
            "$or": [
                {
                    "booking_date": {"$lt": booking_end},
                    "booking_end": {"$gt": booking_start}
                }
            ]
        }))

        # Create set of booked seat IDs
        booked_seat_ids = set()
        for booking in conflicting_bookings:
            booked_seat_ids.update(booking["seat_ids"])

        # Prepare response with availability status
        available_seats = []
        for seat in all_seats:
            seat_id = str(seat["_id"])
            is_booked = seat_id in booked_seat_ids
            
            available_seats.append({
                "id": seat_id,
                "seat_number": seat["seat_number"],
                "status": "unavailable" if is_booked else "available"
            })

        logger.info(f"Found {len(booked_seat_ids)} booked seats")
        return available_seats

    except Exception as e:
        logger.error(f"Error checking seat availability: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{seat_id}")
async def get_seat(
    seat_id: str,
    db = Depends(get_database)
):
    try:
        seat = db.seats.find_one({"_id": ObjectId(seat_id)})
        if not seat:
            raise HTTPException(status_code=404, detail="Seat not found")
        
        seat["id"] = str(seat["_id"])
        del seat["_id"]
        return seat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_all_seats(
    db = Depends(get_database)
):
    try:
        seats = list(db.seats.find({}))
        return [
            {
                "id": str(seat["_id"]),
                "seat_number": seat["seat_number"],
                "status": seat["status"]
            }
            for seat in seats
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))