from pydantic import BaseModel, Field, ConfigDict, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from typing import List, Optional, Any, Annotated
from datetime import datetime
from bson import ObjectId

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
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: Any,
    ) -> dict[str, Any]:
        return {
            'type': 'string',
            'description': 'ObjectId',
            'pattern': r'^[0-9a-fA-F]{24}$'
        }

# Floor Configuration Model
class FloorConfig(BaseModel):
    floor_number: int
    total_seats: int
    sections: List[str]
    has_pool: bool
    special_features: List[str]
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "floor_number": 1,
                "total_seats": 100,
                "sections": ["A", "B", "C"],
                "has_pool": False,
                "special_features": ["window_view"]
            }
        }
    )

# Location Model
class Location(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_code: str
    name: str
    address: str
    total_floors: int
    floors_config: List[FloorConfig]
    operating_hours: dict
    status: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "location_code": "BLR-01",
                "name": "Bangalore Main Cafeteria",
                "address": "123 Tech Park, Bangalore",
                "total_floors": 3,
                "floors_config": [{
                    "floor_number": 1,
                    "total_seats": 100,
                    "sections": ["A", "B", "C"],
                    "has_pool": False,
                    "special_features": ["window_view"]
                }],
                "operating_hours": {
                    "start": "09:00",
                    "end": "18:00"
                },
                "status": "active"
            }
        }
    )

# Seat Model
class Seat(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: str
    seat_number: str
    floor: int
    section: str
    position: dict
    seat_type: str
    status: str
    maintenance_status: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "location_id": "1234567890",
                "seat_number": "A101",
                "floor": 1,
                "section": "A",
                "position": {"x": 10, "y": 20, "angle": 0},
                "seat_type": "regular",
                "status": "available",
                "maintenance_status": "operational"
            }
        }
    )

# Booking Model
class Booking(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: str
    manager_id: str
    team_members: List[str]
    seats: List[str]
    booking_date: datetime
    time_slot: dict
    amount_paid: float
    status: str
    check_in_status: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "location_id": "1234567890",
                "manager_id": "MGR001",
                "team_members": ["EMP001", "EMP002"],
                "seats": ["A101", "A102"],
                "booking_date": "2024-01-01T12:00:00",
                "time_slot": {
                    "start": "12:00",
                    "end": "13:00"
                },
                "amount_paid": 50.0,
                "status": "confirmed",
                "check_in_status": "not_checked_in"
            }
        }
    )