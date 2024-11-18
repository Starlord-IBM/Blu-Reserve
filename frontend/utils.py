import requests
from datetime import datetime, timedelta

API_BASE_URL = "http://localhost:8000"

def get_locations():
    response = requests.get(f"{API_BASE_URL}/locations")
    if response.status_code == 200:
        return response.json()
    return []

def get_seat_availability(location_id, floor, date, time_slot):
    response = requests.get(
        f"{API_BASE_URL}/{location_id}/seats/availability/{floor}/{date}/{time_slot}"
    )
    if response.status_code == 200:
        return response.json()
    return None

def create_booking(location_id, booking_data):
    response = requests.post(
        f"{API_BASE_URL}/{location_id}/bookings/create",
        json=booking_data
    )
    if response.status_code == 200:
        return response.json()
    return None