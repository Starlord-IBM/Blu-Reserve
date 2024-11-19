from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from .object_id import PydanticObjectId

class Location(BaseModel):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    location_code: str
    address: str
    capacity: int = Field(ge=1)
    operating_hours: List[dict] = Field(default_factory=list)
    status: str = "active"
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

    def __init__(self, **data):
        if '_id' in data and isinstance(data['_id'], ObjectId):
            data['_id'] = PydanticObjectId(str(data['_id']))
        super().__init__(**data)