from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import get_database
from ..models import Location
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[Location])
def get_locations(db=Depends(get_database)):
    locations = list(db.locations.find())
    # Convert ObjectId to string for each document
    for loc in locations:
        loc["_id"] = str(loc["_id"])
    return locations

@router.get("/{location_id}", response_model=Location)
def get_location(location_id: str, db=Depends(get_database)):
    try:
        object_id = ObjectId(location_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid location ID format")
        
    location = db.locations.find_one({"_id": object_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Convert ObjectId to string
    location["_id"] = str(location["_id"])
    return location

@router.post("/", response_model=Location)
def create_location(location: Location, db=Depends(get_database)):
    location_dict = location.model_dump(exclude={"id"})
    result = db.locations.insert_one(location_dict)
    
    # Retrieve and return the created document
    created_location = db.locations.find_one({"_id": result.inserted_id})
    created_location["_id"] = str(created_location["_id"])
    return created_location