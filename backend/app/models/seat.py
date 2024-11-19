from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from .object_id import PydanticObjectId

class Seat(BaseModel):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    seat_number: str
    section: str
    status: str = "available"  # available, booked
    price_per_30min: float = 5.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat(),
            PydanticObjectId: str
        }
    )

from pydantic import BaseModel
from typing import Optional
from enum import Enum

class SeatStatus(str, Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    MAINTENANCE = "maintenance"

class SeatBase(BaseModel):
    seat_number: str
    section: str
    status: SeatStatus
    price_per_30min: float = 5.0

class SeatCreate(SeatBase):
    pass

class SeatResponse(SeatBase):
    id: str

    class Config:
        from_attributes = True