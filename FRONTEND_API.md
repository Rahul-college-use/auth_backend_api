# Frontend API Documentation

Complete API reference for the Auth Backend.

## Base URL

```
http://localhost:3000/api/auth
```

## Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | ❌ | Create new user |
| POST | `/login` | ❌ | Authenticate user |
| POST | `/verify-email` | ❌ | Verify email with OTP |
| GET | `/get-me` | ✅ | Get current user |
| GET | `/refresh-token` | ✅ | Get new access token |
| GET | `/logout` | ✅ | Logout current session |
| GET | `/logout-all` | ✅ | Logout all sessions |

---

## Endpoints

### 1. Register User

**Request:**
```
POST /register
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Status: 201 Created**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": false,
    "createdAt": "2026-05-24T04:06:31.234Z"
  }
}
```

**Status: 400 Bad Request**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Email is invalid", "Password too weak"]
}
```

**Status: 409 Conflict**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

### 2. Login

**Request:**
```
POST /login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Status: 200 OK**
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 1800
  },
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": true
  }
}
```

**Status: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Verify Email

**Request (Get OTP):**
```
POST /verify-email
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string"
}
```

**Status: 200 OK**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Request (Submit OTP):**
```
POST /verify-email
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

**Status: 200 OK**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": true
  }
}
```

**Status: 400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 4. Get Current User

**Request:**
```
GET /get-me
Authorization: Bearer {accessToken}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status: 200 OK**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": true,
    "createdAt": "2026-05-24T04:06:31.234Z",
    "updatedAt": "2026-05-24T04:06:31.234Z"
  }
}
```

**Status: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Access token expired or invalid"
}
```

---

### 5. Refresh Token

**Request:**
```
GET /refresh-token
Authorization: Bearer {refreshToken}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status: 200 OK**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 1800
}
```

**Status: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Refresh token expired or invalid"
}
```

---

### 6. Logout (Current Session)

**Request:**
```
GET /logout
Authorization: Bearer {accessToken}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status: 200 OK**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

### 7. Logout All Sessions

**Request:**
```
GET /logout-all
Authorization: Bearer {accessToken}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status: 200 OK**
```json
{
  "success": true,
  "message": "Logged out from all sessions"
}
```

**Status: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

## Authentication Methods

### Bearer Token (Recommended)
```
Authorization: Bearer {accessToken}
```

### Cookie (HTTP-Only)
```
Cookie: accessToken={accessToken}
```

### Query Parameter (Not Recommended)
```
GET /endpoint?token={accessToken}
```

---

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {},
  "errors": []
}
```

---

## Status Codes

| Code | Meaning | Typical Response |
|------|---------|------------------|
| 200 | OK | Successful GET/PUT/PATCH request |
| 201 | Created | Successful POST request creating resource |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing/invalid token or not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable | Validation failed |
| 500 | Internal Server Error | Server error |

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Authentication failed",
  "code": "AUTH_FAILED"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Access denied",
  "code": "NOT_AUTHORIZED"
}
```

---

## Field Validation

### Username
- Min length: 3 characters
- Max length: 32 characters
- Allowed: alphanumeric, underscore, hyphen
- Must be unique

### Email
- Valid email format (RFC 5322)
- Must be unique
- Case insensitive

### Password
- Min length: 8 characters
- Should contain uppercase, lowercase, numbers
- Should contain special characters (recommended)

---

## Token Details

### Access Token
- **Type**: JWT
- **Lifetime**: 15-30 minutes
- **Usage**: Included in `Authorization` header for protected routes
- **Storage**: Memory or localStorage (not recommended for sensitive apps)

### Refresh Token
- **Type**: JWT
- **Lifetime**: 7 days
- **Usage**: Used to get new access token when expired
- **Storage**: HTTP-only secure cookie (recommended)

---

## Rate Limiting

Currently not implemented. Will be added for production.

---

## CORS

The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173` (Vite)

To add more origins, modify backend CORS configuration.

---

## WebSocket Support

Not currently implemented. Will be added for real-time features in future versions.

---

## API Versioning

Current API version: `v1` (implicit)

Future versions will use: `/api/v2/auth`

---

## Changelog

### v1.0.0 (Current)
- User registration
- User login
- Email verification
- Token refresh
- Session management
- User profile endpoint

---

## Support

For issues or questions:
1. Check the [Frontend Integration Guide](./FRONTEND_INTEGRATION.md)
2. Review error messages and status codes
3. Create an issue on GitHub
4. Contact the development team

---

Generated: 2026-05-24
Last Updated: 2026-05-24
