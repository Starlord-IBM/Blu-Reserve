from pymongo import MongoClient
from app.config import settings

class Database:
    client: MongoClient = None
    db = None

db = Database()

def get_database():
    return db.db

def connect_to_mongodb():
    try:
        db.client = MongoClient(settings.mongodb_url)
        db.db = db.client[settings.database_name]
        # Verify the connection
        db.client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

def close_mongodb_connection():
    if db.client:
        db.client.close()
        print("MongoDB connection closed")