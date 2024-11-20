from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_database
from ..models.booking import BookingCreate, BookingResponse
from datetime import datetime, timedelta
from bson import ObjectId
from ..auth import get_current_user
import logging
import pytz

router = APIRouter()
logger = logging.getLogger(__name__)
IST = pytz.timezone('Asia/Kolkata')

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        # Handle timezone conversion
        if booking.booking_date.tzinfo is None:
            booking_start = IST.localize(booking.booking_date)
        else:
            booking_start = booking.booking_date.astimezone(IST)
            
        booking_end = booking_start + timedelta(minutes=booking.duration_minutes)

        logger.info(f"Booking start (IST): {booking_start}")
        logger.info(f"Booking end (IST): {booking_end}")

        # Check for conflicting bookings
        conflicts = list(db.bookings.find({
            "seat_ids": {"$in": booking.seat_ids},
            "status": "active",
            "$or": [
                {
                    "booking_date": {"$lt": booking_end},
                    "booking_end": {"$gt": booking_start}
                }
            ]
        }))

        if conflicts:
            raise HTTPException(
                status_code=400, 
                detail="One or more seats are already booked for this time period"
            )

        # Check blu_dollars
        if current_user.get("blu_dollars", 0) < booking.total_cost:
            raise HTTPException(status_code=400, detail="Insufficient blu_dollars")

        # Create booking document
        booking_doc = {
            "user_id": str(current_user["_id"]),
            "seat_ids": booking.seat_ids,
            "booking_date": booking_start,
            "booking_end": booking_end,
            "duration_minutes": booking.duration_minutes,
            "total_cost": booking.total_cost,
            "status": "active",
            "created_at": datetime.now(IST)
        }

        # Insert booking
        result = db.bookings.insert_one(booking_doc)
        
        # Update user's blu_dollars
        update_result = db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$inc": {"blu_dollars": -float(booking.total_cost)}}
        )
        
        if update_result.modified_count == 0:
            db.bookings.delete_one({"_id": result.inserted_id})
            raise HTTPException(status_code=500, detail="Failed to update blu_dollars")

        # Update seat status
        seat_ids = [ObjectId(sid) for sid in booking.seat_ids]
        db.seats.update_many(
            {"_id": {"$in": seat_ids}},
            {"$set": {"status": "booked"}}
        )

        response = {
            "id": str(result.inserted_id),
            **booking_doc
        }
        
        return response

    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        bookings = list(db.bookings.find(
            {"user_id": str(current_user["_id"])}
        ).sort("booking_date", -1))

        formatted_bookings = []
        for booking in bookings:
            # Calculate booking_end if it doesn't exist
            if 'booking_end' not in booking:
                booking_date = booking['booking_date']
                duration = booking.get('duration_minutes', 30)  # default to 30 if not found
                booking_end = booking_date + timedelta(minutes=duration)
            else:
                booking_end = booking['booking_end']

            formatted_booking = {
                "id": str(booking["_id"]),
                "user_id": booking["user_id"],
                "seat_ids": booking["seat_ids"],
                "booking_date": booking["booking_date"],
                "booking_end": booking_end,
                "duration_minutes": booking.get("duration_minutes", 30),
                "total_cost": booking.get("total_cost", 0),
                "status": booking.get("status", "active"),
                "created_at": booking.get("created_at", booking["booking_date"])
            }
            formatted_bookings.append(formatted_booking)

        return formatted_bookings

    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))