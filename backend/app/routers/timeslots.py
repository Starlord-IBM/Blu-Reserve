from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from typing import List
from ..database import get_database
from ..models import TimeSlot
from bson import ObjectId

router = APIRouter()

@router.get("/{location_id}")
async def get_available_timeslots(
    location_id: str,
    date: str,
    db=Depends(get_database)
):
    try:
        # Convert date string to datetime
        booking_date = datetime.strptime(date, "%Y-%m-%d")
        
        # Get location details
        location = db.locations.find_one({"_id": ObjectId(location_id)})
        if not location:
            raise HTTPException(status_code=404, detail="Location not found")

        # Get operating hours
        operating_hours = location.get('operating_hours', {})
        start_time = operating_hours.get('start', '09:00')
        end_time = operating_hours.get('end', '17:00')
        
        # Convert operating hours to datetime
        start_hour, start_minute = map(int, start_time.split(':'))
        end_hour, end_minute = map(int, end_time.split(':'))

        # Generate time slots
        slots = []
        current_time = datetime.combine(booking_date.date(), 
                                      datetime.min.time().replace(hour=start_hour, minute=start_minute))
        end_datetime = datetime.combine(booking_date.date(), 
                                      datetime.min.time().replace(hour=end_hour, minute=end_minute))

        # Get existing bookings for the date
        existing_bookings = list(db.bookings.find({
            "location_id": location_id,
            "booking_date": {
                "$gte": booking_date,
                "$lt": booking_date + timedelta(days=1)
            },
            "status": "active"
        }))

        # Generate slots every 30 minutes
        while current_time < end_datetime:
            # Only include future time slots
            if current_time > datetime.now():
                # Check if slot is available
                is_available = True
                for booking in existing_bookings:
                    booking_start = booking['time_slot']['start_time']
                    booking_end = booking_start + timedelta(
                        minutes=booking['time_slot']['duration_minutes']
                    )
                    if (current_time < booking_end and 
                        current_time + timedelta(minutes=30) > booking_start):
                        is_available = False
                        break

                if is_available:
                    slots.append({
                        "start_time": current_time.isoformat(),
                        "end_time": (current_time + timedelta(minutes=30)).isoformat(),
                        "available": True
                    })

            current_time += timedelta(minutes=30)

        return slots

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))