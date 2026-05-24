# Auth Backend

A robust Node.js authentication backend service built with Express.js and MongoDB. This project provides comprehensive user authentication features including registration, login, email verification, JWT token management, and session handling.

## Features

- **User Registration** - Create new user accounts with validation
- **User Login** - Authenticate users with JWT tokens
- **Email Verification** - Send OTP via email and verify user accounts
- **Token Management** - JWT-based access tokens with refresh token support
- **Session Management** - Track user sessions with logout functionality
- **Cookie-Based Authentication** - Secure HTTP-only cookies for token storage
- **Password Security** - Encrypted password storage

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.6.2
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Nodemailer 8.0.8
- **Middleware**: Morgan (logging), Cookie Parser
- **Validation**: Validator.js
- **Development**: Nodemon for hot-reloading

## Project Structure

```
Auth_Backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.js     # App configuration
│   │   └── database.js   # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   └── auth.controllers.js
│   ├── models/           # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── session.model.js
│   │   └── otp.model.js
│   ├── routes/           # API routes
│   │   └── auth.routes.js
│   ├── services/         # Business logic services
│   │   └── email.service.js
│   ├── utils/            # Utility functions
│   │   └── utils.js
│   └── app.js            # Express app setup
├── server.js             # Server entry point
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md            # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Auth_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=your_email_service_host
   EMAIL_PORT=your_email_service_port
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string@example.com",
    "password": "string"
  }
  ```

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "string@example.com",
    "password": "string"
  }
  ```

#### Verify Email
- **Endpoint**: `POST /api/auth/verify-email`
- **Description**: Verify user email with OTP
- **Request Body**:
  ```json
  {
    "email": "string@example.com",
    "otp": "string"
  }
  ```

#### Get Current User
- **Endpoint**: `GET /api/auth/get-me`
- **Description**: Get authenticated user details
- **Auth**: Requires valid JWT token

#### Refresh Token
- **Endpoint**: `GET /api/auth/refresh-token`
- **Description**: Get a new access token using refresh token
- **Auth**: Requires valid refresh token

#### Logout
- **Endpoint**: `GET /api/auth/logout`
- **Description**: Logout current session
- **Auth**: Requires valid JWT token

#### Logout All Sessions
- **Endpoint**: `GET /api/auth/logout-all`
- **Description**: Logout from all active sessions
- **Auth**: Requires valid JWT token

## Database Models

### User Model
- `username` - Unique username (required)
- `email` - Unique email address (required)
- `password` - Encrypted password (required)
- `verified` - Email verification status (boolean, default: false)
- `timestamps` - Created and updated timestamps

### Session Model
- Tracks active user sessions
- Supports session termination and multi-device logout

### OTP Model
- Stores one-time passwords for email verification
- Manages OTP expiration

## Scripts

- `npm run dev` - Start development server with auto-reload (using Nodemon)
- `npm start` - Start production server

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `PORT` | Server port | `3000` |
| `EMAIL_HOST` | Email service host | `smtp.gmail.com` |
| `EMAIL_PORT` | Email service port | `587` |
| `EMAIL_USER` | Email service username | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | Email service password | `your_app_password` |

## Security Features

- ✅ Password encryption before storage
- ✅ JWT-based stateless authentication
- ✅ HTTP-only secure cookies
- ✅ Email verification via OTP
- ✅ Unique username and email constraints
- ✅ Session management with logout support

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

## Development

### Hot Reload
The development server uses Nodemon to automatically reload when files change:
```bash
npm run dev
```

### Database Connection
MongoDB connection is established in `src/config/database.js`. Ensure MongoDB is running before starting the server.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Note**: This is an internship project for learning authentication best practices with Node.js and Express.js.
"# auth_backend_api" 
