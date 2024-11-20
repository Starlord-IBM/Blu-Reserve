from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, validator
import pytz
from .object_id import PydanticObjectId

class TimeSlot(BaseModel):
    start_time: datetime
    duration_minutes: int = Field(ge=30, le=120)

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={datetime: lambda dt: dt.isoformat()}
    )

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v not in [30, 60, 90, 120]:
            raise ValueError('Duration must be 30, 60, 90, or 120 minutes')
        return v

class Booking(BaseModel):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    user_id: str
    seat_ids: List[str]
    number_of_people: int = Field(ge=1, le=20)
    booking_date: datetime
    time_slot: TimeSlot
    total_cost: float  # 5 blu dollars per 30 mins per seat
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat(),
            PydanticObjectId: str
        }
    )

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
    
from pydantic import BaseModel, validator
from typing import List
from datetime import datetime

from pydantic import BaseModel
from typing import List
from datetime import datetime
class BookingBase(BaseModel):
    seat_ids: List[str]
    booking_date: datetime
    duration_minutes: int
    total_cost: float

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: str
    user_id: str
    status: str
    booking_end: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True