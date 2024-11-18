# Blu-Reserve: Riveira Cafeteria Seat Booking System

A web application for booking cafeteria seats with FastAPI backend and React frontend.

## Project Structure
```
blu-reserve/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── locations.py
│   │       ├── seats.py
│   │       └── bookings.py
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- MongoDB 4.4 or higher

## Installation

### 1. MongoDB Setup

#### macOS (using Homebrew):
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify MongoDB is running
brew services list
```

#### Windows:
- Download and install MongoDB Community Server from [MongoDB Website](https://www.mongodb.com/try/download/community)
- MongoDB should run as a service automatically

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start Backend Server
In one terminal:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

The backend will be available at:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### 2. Start Frontend Development Server
In another terminal:
```bash
cd frontend
npm start
```

The frontend will be available at:
- http://localhost:3000

## API Endpoints

### Locations
- GET `/api/locations` - Get all locations
- GET `/api/locations/{id}` - Get location by ID
- POST `/api/locations` - Create new location

### Seats
- GET `/api/seats/{location_id}/{floor}` - Get seats by location and floor
- POST `/api/seats` - Create new seat

### Bookings
- GET `/api/bookings/{location_id}` - Get bookings by location
- POST `/api/bookings` - Create new booking

## Frontend Routes

- `/` - Login page
- `/book-seats` - Seat booking page
- `/my-bookings` - View user's bookings

## Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list  # On macOS
# or
sc query MongoDB   # On Windows
```

### Node.js Version Issues
If you encounter OpenSSL-related errors:
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 18
nvm install 18
nvm use 18
```

### Port Already in Use
If port 8000 is already in use:
```bash
# Find process using port 8000
lsof -i :8000  # On macOS/Linux
# or
netstat -ano | findstr :8000  # On Windows

# Kill the process
kill <PID>  # On macOS/Linux
# or
taskkill /F /PID <PID>  # On Windows
```

## Development

### Adding New API Endpoints
1. Create new router file in `backend/app/routers/`
2. Define routes using FastAPI router
3. Include router in `backend/app/main.py`

### Adding New Frontend Pages
1. Create new component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Update navigation components as needed

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Contact

Your Name - Bhargav.Raj2@ibm.com
Project Link: [https://github.com/yourusername/blu-reserve](https://github.com/Starlord-IBM/blu-reserve)

---
