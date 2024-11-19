from pymongo import MongoClient
from datetime import datetime
from passlib.context import CryptContext

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
client = MongoClient('mongodb://localhost:27017')
db = client.blu_reserve

# Default user credentials
DEFAULT_USER = {
    "username": "admin",
    "email": "admin@ibm.com",
    "password": pwd_context.hash("admin123"),  # This will hash "admin123"
    "blu_dollars": 10000.0,
    "created_at": datetime.utcnow()
}

def create_default_user():
    try:
        # Check if user already exists
        existing_user = db.users.find_one({"email": DEFAULT_USER["email"]})
        
        if existing_user:
            print(f"Default user already exists with email: {DEFAULT_USER['email']}")
            return
        
        # Create new user
        result = db.users.insert_one(DEFAULT_USER)
        print(f"Created default user with ID: {result.inserted_id}")
        print("\nDefault User Credentials:")
        print(f"Email: {DEFAULT_USER['email']}")
        print(f"Password: admin123")
        
    except Exception as e:
        print(f"Error creating default user: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    create_default_user()