# backend/scripts/init_db.py
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['blu_reserve']

sample_location = {
    "location_code": "BLR-01",
    "name": "Main Cafeteria",
    "address": "123 Main Street",
    "total_floors": 1,
    "floors_config": [
        {
            "floor_number": 1,
            "total_seats": 60,
            "sections": ["A", "B", "C"]
        }
    ],
    "operating_hours": {
        "start": "09:00",
        "end": "17:00"
    },
    "status": "active"
}

# Insert sample location if it doesn't exist
if not db.locations.find_one({"location_code": "BLR-01"}):
    db.locations.insert_one(sample_location)