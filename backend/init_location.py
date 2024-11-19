from pymongo import MongoClient
from datetime import datetime, time
import pytz

def init_locations():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client['blu_reserve']

    # Sample operating hours - 24 hour format
    default_hours = [
        {
            "day": "Monday",
            "open_time": "09:00",
            "close_time": "22:00"
        },
        {
            "day": "Tuesday",
            "open_time": "09:00",
            "close_time": "22:00"
        },
        {
            "day": "Wednesday",
            "open_time": "09:00",
            "close_time": "22:00"
        },
        {
            "day": "Thursday",
            "open_time": "09:00",
            "close_time": "22:00"
        },
        {
            "day": "Friday",
            "open_time": "09:00",
            "close_time": "23:00"
        },
        {
            "day": "Saturday",
            "open_time": "10:00",
            "close_time": "23:00"
        },
        {
            "day": "Sunday",
            "open_time": "10:00",
            "close_time": "21:00"
        }
    ]

    # Sample locations
    sample_locations = [
        {
            "name": "Downtown Hub",
            "location_code": "DTH001",
            "address": "123 Main St, Downtown",
            "capacity": 50,
            "operating_hours": default_hours,
            "status": "active",
            "created_at": datetime.now(pytz.UTC)
        },
        {
            "name": "Tech Park Branch",
            "location_code": "TPB001",
            "address": "456 Innovation Ave, Tech District",
            "capacity": 75,
            "operating_hours": default_hours,
            "status": "active",
            "created_at": datetime.now(pytz.UTC)
        },
        {
            "name": "University Center",
            "location_code": "UNC001",
            "address": "789 College Blvd, University District",
            "capacity": 100,
            "operating_hours": default_hours,
            "status": "active",
            "created_at": datetime.now(pytz.UTC)
        },
        {
            "name": "Business District Hub",
            "location_code": "BDH001",
            "address": "321 Commerce St, Financial District",
            "capacity": 60,
            "operating_hours": default_hours,
            "status": "active",
            "created_at": datetime.now(pytz.UTC)
        },
        {
            "name": "Creative Quarter",
            "location_code": "CRQ001",
            "address": "567 Arts Ave, Design District",
            "capacity": 40,
            "operating_hours": default_hours,
            "status": "active",
            "created_at": datetime.now(pytz.UTC)
        }
    ]

    try:
        # First, drop the existing index if it exists
        try:
            db.locations.drop_index("location_code_1")
        except Exception:
            pass

        # Create a new unique index for location_code
        db.locations.create_index("location_code", unique=True)

        # Insert or update locations
        for location in sample_locations:
            existing = db.locations.find_one({"location_code": location["location_code"]})
            if not existing:
                result = db.locations.insert_one(location)
                print(f"Created location: {location['name']} with ID: {result.inserted_id}")
            else:
                # Update existing location
                db.locations.update_one(
                    {"location_code": location["location_code"]},
                    {"$set": {
                        "name": location["name"],
                        "address": location["address"],
                        "capacity": location["capacity"],
                        "operating_hours": location["operating_hours"],
                        "status": location["status"],
                        "updated_at": datetime.now(pytz.UTC)
                    }}
                )
                print(f"Updated location: {location['name']}")

        print("\nLocation initialization completed successfully!")
        
        # Print all locations
        print("\nCurrent locations in database:")
        for loc in db.locations.find():
            print(f"- {loc['name']} (Code: {loc['location_code']}, Capacity: {loc['capacity']})")

    except Exception as e:
        print(f"Error initializing locations: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    init_locations()