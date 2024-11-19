from pymongo import MongoClient
from datetime import datetime
import pytz

def init_seats():
    client = MongoClient('mongodb://localhost:27017')
    db = client.blu_reserve

    try:
        # Check if seats already exist
        existing_seats = db.seats.count_documents({})
        if existing_seats > 0:
            print(f"Found {existing_seats} existing seats. Skipping initialization.")
            return

        # Initialize seats
        seats = []
        sections = ['A', 'B', 'C']
        seats_per_section = 10

        for section in sections:
            for i in range(1, seats_per_section + 1):
                seat = {
                    "seat_number": f"{section}{i:02d}",
                    "section": section,
                    "status": "available",
                    "price_per_30min": 5.0,
                    "created_at": datetime.now(pytz.UTC)
                }
                seats.append(seat)

        if seats:
            result = db.seats.insert_many(seats)
            print(f"Successfully initialized {len(result.inserted_ids)} seats")
            
            # Create index on seat_number
            db.seats.create_index("seat_number", unique=True)
            print("Created index on seat_number")

    except Exception as e:
        print(f"Error initializing seats: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    init_seats()