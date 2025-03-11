# Date Finder - Location-based Dating App

A full-stack dating application that helps users find potential matches near their location using OpenStreetMap.

## Features

- User registration and authentication
- Profile creation and management
- Location-based user discovery
- Interactive map view of nearby users
- Match system (like/skip)
- Real-time messaging between matched users
- Preference settings (distance, age range, gender)

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

### Frontend
- AngularJS
- Bootstrap 3
- Leaflet.js (for OpenStreetMap integration)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Setup

1. Clone the repository
```
git clone https://github.com/yourusername/date-finder.git
cd date-finder
```

2. Install dependencies for backend
```
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/datingapp
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

4. Install dependencies for frontend
```
cd ../client
npm install
```

## Running the Application

1. Start MongoDB
```
mongod
```

2. Start the backend server
```
cd server
npm run dev
```

3. Serve the frontend (in a new terminal)
```
cd client
npm start
```

4. Open your browser and navigate to `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login and get token

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Location
- `PUT /api/location` - Update user location
- `GET /api/location/nearby` - Get nearby users

### Matches
- `POST /api/matches` - Create a new match request
- `PUT /api/matches/:id` - Update match status
- `GET /api/matches` - Get user's matches
- `GET /api/matches/pending` - Get pending match requests

### Messages
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages/:matchId` - Send a message

## Deployment

The application can be deployed to any hosting platform that supports Node.js applications. For production deployment, consider the following steps:

1. Configure proper environment variables for production
2. Set up a production MongoDB database
3. Build the frontend for production
4. Configure CORS for security
5. Set up SSL/TLS for secure communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.