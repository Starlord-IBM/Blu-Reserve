from datetime import datetime, timedelta
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict, validator
import pytz
from bson import ObjectId

# Add this PyObjectId class to handle ObjectId conversion
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

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
    duration_minutes: int = Field(ge=30, le=120)

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v not in [30, 60, 90, 120]:
            raise ValueError('Duration must be 30, 60, 90, or 120 minutes')
        return v

    @validator('start_time')
    def validate_timezone(cls, v):
        if v.tzinfo is None:
            return v.replace(tzinfo=pytz.UTC)
        return v

class Booking(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: str
    user_id: str
    seat_ids: List[str]
    number_of_people: int = Field(ge=1, le=20)
    booking_date: datetime
    time_slot: TimeSlot
    status: str = "active"
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @validator('booking_date')
    def validate_timezone_booking_date(cls, v):
        if v.tzinfo is None:
            return v.replace(tzinfo=pytz.UTC)
        return v

    @validator('number_of_people')
    def validate_number_of_people(cls, v, values):
        if 'seat_ids' in values and len(values['seat_ids']) != v:
            raise ValueError('Number of seats must match number of people')
        return v

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

class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    password: str
    email: str
    full_name: str
    role: str = "user"  # user, admin
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"  # active, inactive

    model_config = ConfigDict(arbitrary_types_allowed=True)