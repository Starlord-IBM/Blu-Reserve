from pymongo import MongoClient, ASCENDING
from datetime import datetime

def reset_bookings_collection():
    client = MongoClient('mongodb://localhost:27017')
    db = client.blu_reserve

    # Drop the existing bookings collection
    print("Dropping existing bookings collection...")
    if "bookings" in db.list_collection_names():
        db.bookings.drop()

    # Create new bookings collection with updated schema
    print("Creating new bookings collection...")
    db.create_collection("bookings")
    
    # Update the schema
    print("Updating schema validation...")
    db.command({
        "collMod": "bookings",
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["user_id", "seat_ids", "booking_date", "duration_minutes", "status", "total_cost"],
                "properties": {
                    "user_id": {
                        "bsonType": "objectId",
                        "description": "must be an objectId and is required"
                    },
                    "seat_ids": {
                        "bsonType": "array",
                        "items": {
                            "bsonType": "string"
                        },
                        "description": "must be an array of strings and is required"
                    },
                    "booking_date": {
                        "bsonType": "date",
                        "description": "must be a date and is required"
                    },
                    "duration_minutes": {
                        "bsonType": "int",
                        "description": "must be an integer and is required"
                    },
                    "status": {
                        "enum": ["active", "cancelled", "completed"],
                        "description": "must be one of the enum values and is required"
                    },
                    "total_cost": {
                        "bsonType": "double",
                        "description": "must be a double and is required"
                    },
                    "created_at": {
                        "bsonType": "date",
                        "description": "must be a date"
                    }
                },
                "additionalProperties": True
            }
        },
        "validationLevel": "strict",
        "validationAction": "error"
    })

    # Create indexes
    print("Creating indexes...")
    db.bookings.create_index([("user_id", ASCENDING)])
    db.bookings.create_index([("booking_date", ASCENDING)])
    db.bookings.create_index([("status", ASCENDING)])

    print("Bookings collection reset successfully!")
    client.close()

if __name__ == "__main__":
    reset_bookings_collection()