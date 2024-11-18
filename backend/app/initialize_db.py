from pymongo import MongoClient
from datetime import datetime
import math

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['blu_reserve']

# Sample data for Locations
location_data = {
    "location_code": "BLR-01",
    "name": "Bangalore Main Cafeteria",
    "address": "123 Tech Park, Bangalore",
    "total_floors": 3,
    "floors_config": [
        {
            "floor_number": 0,
            "total_seats": 100,
            "sections": ["A", "B", "C", "D"],
            "has_pool": True,
            "special_features": ["fountain", "outdoor_seating"]
        },
        {
            "floor_number": 1,
            "total_seats": 80,
            "sections": ["E", "F", "G"],
            "has_pool": False,
            "special_features": ["private_rooms"]
        },
        {
            "floor_number": 2,
            "total_seats": 60,
            "sections": ["H", "I"],
            "has_pool": False,
            "special_features": ["executive_area"]
        }
    ],
    "operating_hours": {
        "start": "09:00",
        "end": "18:00"
    },
    "status": "active"
}

# Function to generate seats for a floor
def generate_seats(location_id, floor, sections, seats_per_section):
    seats = []
    for section in sections:
        for i in range(seats_per_section):
            seat_number = f"{section}{i+1:03d}"
            # Calculate position based on circular layout
            angle = (360 / (len(sections) * seats_per_section)) * (len(seats))
            x = 50 + 30 * math.cos(math.radians(angle))
            y = 50 + 30 * math.sin(math.radians(angle))
            
            seats.append({
                "location_id": location_id,
                "seat_number": seat_number,
                "floor": floor,
                "section": section,
                "position": {
                    "x": x,
                    "y": y,
                    "angle": angle
                },
                "seat_type": "regular",
                "status": "available",
                "maintenance_status": "operational"
            })
    return seats

# Script to initialize database
def initialize_database():
    # Clear existing collections
    db.locations.drop()
    db.seats.drop()
    db.bookings.drop()

    # Insert location
    location_result = db.locations.insert_one(location_data)
    location_id = str(location_result.inserted_id)
    print(f"Created location with ID: {location_id}")

    # Generate and insert seats for each floor
    import math
    all_seats = []
    for floor_config in location_data["floors_config"]:
        floor_seats = generate_seats(
            location_id,
            floor_config["floor_number"],
            floor_config["sections"],
            floor_config["total_seats"] // len(floor_config["sections"])
        )
        all_seats.extend(floor_seats)

    if all_seats:
        db.seats.insert_many(all_seats)
        print(f"Created {len(all_seats)} seats")

    # Create indexes
    db.locations.create_index("location_code", unique=True)
    db.seats.create_index([("location_id", 1), ("seat_number", 1)], unique=True)
    db.bookings.create_index([
        ("location_id", 1),
        ("booking_date", 1),
        ("time_slot.start", 1)
    ])

    print("Database initialization completed")

# Sample booking creation function
def create_sample_booking(location_id, seats):
    booking_data = {
        "location_id": location_id,
        "manager_id": "MGR001",
        "team_members": ["EMP001", "EMP002"],
        "seats": seats,
        "booking_date": datetime.now(),
        "time_slot": {
            "start": datetime.now(),
            "end": datetime.now()
        },
        "amount_paid": 50.0,
        "status": "confirmed",
        "check_in_status": "not_checked_in"
    }
    result = db.bookings.insert_one(booking_data)
    return result.inserted_id

if __name__ == "__main__":
    initialize_database()


# Check collections
print("\nCollections in database:")
print(db.list_collection_names())

# Check location data
print("\nLocations:")
for loc in db.locations.find():
    print(f"Location: {loc['name']} ({loc['location_code']})")

# Check seats
print("\nSeats count by floor:")
pipeline = [
    {"$group": {"_id": "$floor", "count": {"$sum": 1}}}
]
for result in db.seats.aggregate(pipeline):
    print(f"Floor {result['_id']}: {result['count']} seats")