from datetime import datetime, timedelta
from typing import List, Optional, Dict
from pydantic import BaseModel, Field, ConfigDict, validator

class OperatingHours(BaseModel):
    start: str  # Format: "HH:MM"
    end: str    # Format: "HH:MM"
    
    @validator('start', 'end')
    def validate_time_format(cls, v):
        try:
            hour, minute = map(int, v.split(':'))
            if not (0 <= hour <= 23 and 0 <= minute <= 59):
                raise ValueError
            return f"{hour:02d}:{minute:02d}"
        except:
            raise ValueError("Time must be in HH:MM format")

class FloorConfig(BaseModel):
    floor_number: int
    total_seats: int
    sections: List[str]

class Location(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_code: str
    name: str
    address: str
    total_floors: int
    floors_config: List[FloorConfig]
    operating_hours: OperatingHours
    status: str = "active"  # active, inactive, maintenance

    model_config = ConfigDict(arbitrary_types_allowed=True)

class TimeSlot(BaseModel):
    start_time: datetime
    duration_minutes: int = Field(ge=10, le=120)

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v % 5 != 0:  # Ensure duration is in multiples of 5 minutes
            raise ValueError('Duration must be in multiples of 5 minutes')
        return v

    @property
    def end_time(self) -> datetime:
        return self.start_time + timedelta(minutes=self.duration_minutes)

    model_config = ConfigDict(arbitrary_types_allowed=True)

class Seat(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: str
    seat_number: str
    floor: int
    section: str
    position: Dict[str, float]  # x, y coordinates
    status: str = "available"  # available, maintenance, reserved
    is_available: bool = True

    model_config = ConfigDict(arbitrary_types_allowed=True)

class Booking(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: str
    user_id: str
    seat_ids: List[str]  # Changed from seat_id to seat_ids for multiple seats
    number_of_people: int = Field(ge=1, le=20)  # Maximum 20 people
    booking_date: datetime
    time_slot: TimeSlot
    status: str = "active"  # active, completed, cancelled
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    @validator('number_of_people')
    def validate_number_of_people(cls, v):
        if v < 1 or v > 20:
            raise ValueError('Number of people must be between 1 and 20')
        return v

    @validator('seat_ids')
    def validate_seats_count(cls, v, values):
        if 'number_of_people' in values and len(v) != values['number_of_people']:
            raise ValueError('Number of selected seats must match number of people')
        return v

    model_config = ConfigDict(arbitrary_types_allowed=True)