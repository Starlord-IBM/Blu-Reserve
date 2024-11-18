import streamlit as st
import datetime
from utils import get_locations, get_seat_availability, create_booking

def init_session_state():
    if 'selected_seats' not in st.session_state:
        st.session_state.selected_seats = []
    if 'booking_step' not in st.session_state:
        st.session_state.booking_step = 1

def main():
    st.title("Blu-Reserve: Cafeteria Seat Booking")
    init_session_state()

    # Step 1: Location Selection
    locations = get_locations()
    selected_location = st.selectbox(
        "Select Cafeteria Location",
        options=locations,
        format_func=lambda x: f"{x['name']} ({x['location_code']})"
    )

    if selected_location:
        # Step 2: Date and Time Selection
        col1, col2 = st.columns(2)
        with col1:
            selected_date = st.date_input(
                "Select Date",
                min_value=datetime.date.today(),
                max_value=datetime.date.today() + datetime.timedelta(days=7)
            )
        with col2:
            time_slots = [
                "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"
            ]
            selected_time = st.selectbox("Select Time Slot", time_slots)

        # Step 3: Floor Selection
        selected_floor = st.selectbox(
            "Select Floor",
            options=range(selected_location['total_floors']),
            format_func=lambda x: f"Floor {x}"
        )

        # Get seat availability
        availability = get_seat_availability(
            selected_location['_id'],
            selected_floor,
            selected_date.strftime("%Y-%m-%d"),
            selected_time
        )

        if availability:
            st.write(f"Available Seats: {availability['total_seats'] - availability['booked_seats']}")
            
            # Display seat map (simplified version)
            seats = availability['available_seats']
            cols = st.columns(4)
            for idx, seat in enumerate(seats):
                col_idx = idx % 4
                with cols[col_idx]:
                    if st.button(f"Seat {seat['seat_number']}", key=seat['_id']):
                        if seat['_id'] not in st.session_state.selected_seats:
                            st.session_state.selected_seats.append(seat['_id'])
                        else:
                            st.session_state.selected_seats.remove(seat['_id'])

            # Display selected seats
            if st.session_state.selected_seats:
                st.write("Selected Seats:", st.session_state.selected_seats)
                
                # Booking confirmation
                if st.button("Confirm Booking"):
                    booking_data = {
                        "location_id": selected_location['_id'],
                        "manager_id": "test_manager",  # Replace with actual manager ID
                        "team_members": [],  # Add team members selection
                        "seats": st.session_state.selected_seats,
                        "booking_date": selected_date.strftime("%Y-%m-%d"),
                        "time_slot": {
                            "start": selected_time,
                            "end": (datetime.datetime.strptime(selected_time, "%H:%M") + 
                                   datetime.timedelta(minutes=30)).strftime("%H:%M")
                        },
                        "amount_paid": len(st.session_state.selected_seats) * 10.0,  # Example price
                        "status": "confirmed",
                        "check_in_status": "not_checked_in"
                    }
                    
                    result = create_booking(selected_location['_id'], booking_data)
                    if result:
                        st.success(f"Booking confirmed! Booking ID: {result['booking_id']}")
                        st.session_state.selected_seats = []
                    else:
                        st.error("Booking failed. Please try again.")

if __name__ == "__main__":
    main()