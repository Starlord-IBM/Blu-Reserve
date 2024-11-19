from pymongo import MongoClient
from datetime import datetime
from passlib.hash import bcrypt

def init_users():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017')
        db = client['blu_reserve']

        # Sample user data
        sample_users = [
            {
                "username": "admin",
                "password": bcrypt.hash("admin123"),
                "email": "admin@blureserve.com",
                "full_name": "Admin User",
                "role": "admin",
                "status": "active",
                "created_at": datetime.utcnow()
            },
            {
                "username": "user1",
                "password": bcrypt.hash("user123"),
                "email": "user1@example.com",
                "full_name": "Regular User",
                "role": "user",
                "status": "active",
                "created_at": datetime.utcnow()
            }
        ]

        # Insert sample users
        for user in sample_users:
            existing_user = db.users.find_one({"username": user["username"]})
            if not existing_user:
                result = db.users.insert_one(user)
                print(f"Created user: {user['username']} with ID: {result.inserted_id}")
            else:
                print(f"User {user['username']} already exists")

        print("User initialization completed successfully!")
        
    except Exception as e:
        print(f"Error initializing users: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    init_users()