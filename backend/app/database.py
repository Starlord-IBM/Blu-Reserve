from pymongo import MongoClient
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class Database:
    client: Optional[MongoClient] = None
    db = None

def get_database():
    """
    Get database connection
    """
    if Database.client is None:
        try:
            logger.info("Connecting to MongoDB...")
            Database.client = MongoClient("mongodb://localhost:27017")
            Database.db = Database.client.blu_reserve
            
            # Verify connection
            Database.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise e
    return Database.db

def _create_indexes(db):
    """
    Create necessary indexes for the collections
    """
    try:
        # Users collection indexes
        db.users.create_index("email", unique=True)
        db.users.create_index("username")

        # Bookings collection indexes
        db.bookings.create_index([
            ("user_id", 1),
            ("status", 1)
        ])
        db.bookings.create_index([
            ("booking_date", 1),
            ("status", 1)
        ])

        # Seats collection indexes
        db.seats.create_index("seat_number", unique=True)
        db.seats.create_index([
            ("section", 1),
            ("status", 1)
        ])

        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
        raise e

def close_database():
    """
    Close database connection
    """
    if Database.client is not None:
        Database.client.close()
        Database.client = None
        logger.info("Closed MongoDB connection")

# Configuration for collections
COLLECTIONS = {
    'users': {
        'validator': {
            '$jsonSchema': {
                'bsonType': 'object',
                'required': ['username', 'email', 'password', 'blu_dollars'],
                'properties': {
                    'username': {
                        'bsonType': 'string',
                        'description': 'must be a string and is required'
                    },
                    'email': {
                        'bsonType': 'string',
                        'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                        'description': 'must be a valid email address and is required'
                    },
                    'password': {
                        'bsonType': 'string',
                        'description': 'must be a string and is required'
                    },
                    'blu_dollars': {
                        'bsonType': 'double',
                        'minimum': 0,
                        'description': 'must be a non-negative number and is required'
                    }
                }
            }
        }
    },
    'bookings': {
        'validator': {
            '$jsonSchema': {
                'bsonType': 'object',
                'required': ['user_id', 'seat_ids', 'booking_date', 'time_slot', 'status'],
                'properties': {
                    'user_id': {
                        'bsonType': 'string',
                        'description': 'must be a string and is required'
                    },
                    'seat_ids': {
                        'bsonType': 'array',
                        'items': {
                            'bsonType': 'string'
                        },
                        'description': 'must be an array of strings and is required'
                    },
                    'booking_date': {
                        'bsonType': 'date',
                        'description': 'must be a date and is required'
                    },
                    'status': {
                        'enum': ['active', 'completed', 'cancelled'],
                        'description': 'can only be one of the enum values'
                    }
                }
            }
        }
    },
    'seats': {
        'validator': {
            '$jsonSchema': {
                'bsonType': 'object',
                'required': ['seat_number', 'section', 'status'],
                'properties': {
                    'seat_number': {
                        'bsonType': 'string',
                        'description': 'must be a string and is required'
                    },
                    'section': {
                        'bsonType': 'string',
                        'description': 'must be a string and is required'
                    },
                    'status': {
                        'enum': ['available', 'booked', 'maintenance'],
                        'description': 'can only be one of the enum values'
                    }
                }
            }
        }
    }
}

def init_collections():
    """
    Initialize collections with validators if they don't exist
    """
    db = get_database()
    existing_collections = db.list_collection_names()
    
    for collection_name, config in COLLECTIONS.items():
        if collection_name not in existing_collections:
            try:
                db.create_collection(collection_name, validator=config['validator'])
                logger.info(f"Created collection: {collection_name}")
            except Exception as e:
                logger.error(f"Error creating collection {collection_name}: {e}")
                raise e
        else:
            try:
                db.command('collMod', collection_name, validator=config['validator'])
                logger.info(f"Updated validator for collection: {collection_name}")
            except Exception as e:
                logger.error(f"Error updating validator for collection {collection_name}: {e}")
                raise e

# Database error handler decorator
def handle_db_errors(func):
    """
    Decorator to handle database errors
    """
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Database error in {func.__name__}: {str(e)}")
            raise e
    return wrapper

# Example usage of the decorator
@handle_db_errors
def get_user_by_email(email: str):
    db = get_database()
    return db.users.find_one({"email": email})

@handle_db_errors
def get_user_bookings(user_id: str):
    db = get_database()
    return list(db.bookings.find({"user_id": user_id}))

@handle_db_errors
def get_available_seats(booking_date, duration):
    db = get_database()
    # Add your seat availability logic here
    return list(db.seats.find({"status": "available"}))

# Initialize everything when imported
try:
    db = get_database()
    init_collections()
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    raise e