import streamlit as st
import requests
from datetime import datetime, timedelta

# Configure page
st.set_page_config(
    page_title="Blu-Reserve",
    page_icon="🏢",
    layout="wide"
)

# API endpoint
API_BASE_URL = "http://localhost:8000/api"

def get_locations():
    try:
        response = requests.get(f"{API_BASE_URL}/locations")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

def main():
    st.title("Blu-Reserve: Cafeteria Seat Booking")
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Book Seats", "My Bookings", "About"]
    )

    if page == "Book Seats":
        st.header("Book Cafeteria Seats")
        
        # Location selection
        locations = get_locations()
        if not locations:
            st.warning("No locations available or unable to connect to server")
            return
            
        location = st.selectbox(
            "Select Location",
            options=locations,
            format_func=lambda x: f"{x['name']} ({x['location_code']})"
        )

        if location:
            # Date selection
            col1, col2 = st.columns(2)
            with col1:
                selected_date = st.date_input(
                    "Select Date",
                    min_value=datetime.now().date(),
                    max_value=datetime.now().date() + timedelta(days=7)
                )
            
            with col2:
                selected_time = st.selectbox(
                    "Select Time Slot",
                    ["11:30", "12:00", "12:30", "13:00", "13:30", "14:00"]
                )

            # Floor selection
            selected_floor = st.selectbox(
                "Select Floor",
                range(location['total_floors'])
            )

            st.write("Seat map will be displayed here")
            # TODO: Implement seat map visualization

    elif page == "My Bookings":
        st.header("My Bookings")
        st.write("Your bookings will be displayed here")
        # TODO: Implement bookings display

    else:  # About page
        st.header("About Blu-Reserve")
        st.write("""
        Blu-Reserve is a cafeteria seat reservation system designed to help manage 
        seating during peak hours. Managers can book seats for their team members 
        using Blu-Dollars.
        """)

if __name__ == "__main__":
    main()