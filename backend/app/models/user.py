from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from .object_id import PydanticObjectId

class User(BaseModel):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    username: str
    email: str
    password: str
    blu_dollars: float = Field(default=10000.0)  # Initial blu dollars
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

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    blu_dollars: float