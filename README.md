# Secure Messaging App

A full-stack secure messaging application with real-time capabilities built with React Native (frontend) and Node.js/Express (backend).

## Features

- Secure user authentication
- End-to-end encrypted messaging
- Real-time message delivery using Socket.IO
- Friend/contact management system
- Media file sharing
- Mobile-first design with React Native

## Project Structure

The project is divided into two main parts:

### Frontend

- React Native mobile application
- TypeScript for type safety
- Redux for state management
- Socket.IO client for real-time communication
- Navigation using React Navigation

### Backend

- Node.js with Express
- MongoDB database
- Socket.IO for real-time events
- JWT authentication
- Input validation
- Rate limiting

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB instance
- React Native development environment set up

### Installation

#### Backend

1. Navigate to the backend folder:
   ```
   cd messaging-app-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm start
   ```

#### Frontend

1. Navigate to the frontend folder:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React Native development server:
   ```
   npm start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   # or
   npm run ios
   ```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting for authentication endpoints
- End-to-end encryption for messages

## API Documentation

The API provides endpoints for:

- User authentication (register, login)
- Message sending and retrieval
- Contact/friend management
- Media uploads
- User profile management

## Development

For active development, you can use:

```
# Backend
npm run dev

# Frontend
npm start
```

## Deployment

Instructions for deploying to production environments can be found in the respective documentation.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
"# MessagingApp" 
