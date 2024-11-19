from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..database import get_database
from ..models import Location, PydanticObjectId
from datetime import datetime
import pytz
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[Location])
async def get_locations(db=Depends(get_database)):
    try:
        # Fetch all active locations and convert ObjectId to string
        locations = []
        for loc in db.locations.find({"status": "active"}):
            if "_id" in loc:
                loc["_id"] = PydanticObjectId(str(loc["_id"]))
            locations.append(Location(**loc))
        return locations
    except Exception as e:
        print(f"Error fetching locations: {str(e)}")  # For debugging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching locations: {str(e)}"
        )

@router.get("/{location_id}", response_model=Location)
async def get_location(location_id: str, db=Depends(get_database)):
    try:
        location = db.locations.find_one({"_id": ObjectId(location_id)})
        if location is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found"
            )
        location["_id"] = PydanticObjectId(str(location["_id"]))
        return Location(**location)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching location: {str(e)}"
        )

@router.post("/", response_model=Location)
async def create_location(location: Location, db=Depends(get_database)):
    try:
        # Check if location code already exists
        existing = db.locations.find_one({"location_code": location.location_code})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location code already exists"
            )

        location_dict = location.model_dump(exclude={"id"}, by_alias=True)
        location_dict["created_at"] = datetime.now(pytz.UTC)
        
        result = db.locations.insert_one(location_dict)
        created_location = db.locations.find_one({"_id": result.inserted_id})
        
        if created_location:
            created_location["_id"] = PydanticObjectId(str(created_location["_id"]))
            return Location(**created_location)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create location"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{location_id}", response_model=Location)
async def update_location(location_id: str, location: Location, db=Depends(get_database)):
    try:
        location_dict = location.model_dump(exclude={"id"}, by_alias=True)
        location_dict["updated_at"] = datetime.now(pytz.UTC)
        
        result = db.locations.update_one(
            {"_id": ObjectId(location_id)},
            {"$set": location_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found"
            )
            
        updated_location = db.locations.find_one({"_id": ObjectId(location_id)})
        if updated_location:
            updated_location["_id"] = PydanticObjectId(str(updated_location["_id"]))
            return Location(**updated_location)
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update location"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{location_id}")
async def delete_location(location_id: str, db=Depends(get_database)):
    try:
        result = db.locations.update_one(
            {"_id": ObjectId(location_id)},
            {"$set": {
                "status": "inactive",
                "updated_at": datetime.now(pytz.UTC)
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found"
            )
            
        return {"message": "Location deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )