from pymongo import MongoClient, ASCENDING
import time

def fix_database():
    client = MongoClient('mongodb://localhost:27017')
    db = client.blu_reserve
    
    print("Dropping bookings collection if exists...")
    if "bookings" in db.list_collection_names():
        db.bookings.drop()
    
    time.sleep(1)  # Wait for the drop to complete
    
    print("Creating bookings collection...")
    db.create_collection("bookings")
    
    time.sleep(1)  # Wait for creation to complete
    
    print("Setting up schema validation...")
    validation = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "seat_ids", "booking_date", "duration_minutes", "status"],
            "properties": {
                "user_id": {
                    "bsonType": "objectId"
                },
                "seat_ids": {
                    "bsonType": "array"
                },
                "booking_date": {
                    "bsonType": "date"
                },
                "duration_minutes": {
                    "bsonType": "int"
                },
                "status": {
                    "enum": ["active", "cancelled", "completed"]
                },
                "total_cost": {
                    "bsonType": "double"
                },
                "created_at": {
                    "bsonType": "date"
                }
            }
        }
    }

    try:
        db.command({
            "collMod": "bookings",
            "validator": validation,
            "validationLevel": "strict",
            "validationAction": "error"
        })
        print("Schema validation updated successfully!")
    except Exception as e:
        print(f"Error updating schema: {str(e)}")
        return

    print("Creating indexes...")
    db.bookings.create_index([("user_id", ASCENDING)])
    db.bookings.create_index([("booking_date", ASCENDING)])
    
    print("Database setup completed!")
    client.close()

if __name__ == "__main__":
    fix_database()