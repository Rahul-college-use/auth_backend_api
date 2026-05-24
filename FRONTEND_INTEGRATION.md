# Frontend Integration Guide

Complete guide for integrating your frontend application with the Auth Backend API.

## API Base URL

```
http://localhost:3000/api/auth
```

## Authentication Flow

### 1. Registration Flow

**Step 1: Register User**
```javascript
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": false
  }
}
```

**Response (Error - 400/409):**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": ["Email already in use"]
}
```

### 2. Email Verification Flow

**Step 1: Request OTP**
```javascript
POST /verify-email
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Step 2: User enters OTP from email and verifies**
```javascript
POST /verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (Success - 200):**
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

### 3. Login Flow

**Step 1: Login with credentials**
```javascript
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "verified": true
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Protected Routes

All protected routes require the `accessToken` in the Authorization header:

```javascript
Authorization: Bearer {accessToken}
```

Or via cookies (HTTP-only):
```
Cookie: accessToken={accessToken}
```

### Get Current User

**Endpoint:**
```javascript
GET /get-me
Authorization: Bearer {accessToken}
```

**Response (Success - 200):**
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

### Refresh Access Token

**Endpoint:**
```javascript
GET /refresh-token
Authorization: Bearer {refreshToken}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout (Current Session)

**Endpoint:**
```javascript
GET /logout
Authorization: Bearer {accessToken}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Logout All Sessions

**Endpoint:**
```javascript
GET /logout-all
Authorization: Bearer {accessToken}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out from all sessions"
}
```

## Frontend Implementation Examples

### JavaScript/Fetch

```javascript
// Registration
async function register(username, email, password) {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ username, email, password })
  });
  return response.json();
}

// Login
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
  }
  return data;
}

// Get Current User (Protected)
async function getCurrentUser(token) {
  const response = await fetch('http://localhost:3000/api/auth/get-me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return response.json();
}

// Refresh Token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
}

// Logout
async function logout(token) {
  const response = await fetch('http://localhost:3000/api/auth/logout', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return response.json();
}
```

### React Example

```javascript
import { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Axios Example

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/refresh-token`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
          }
        });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Redirect to login
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Proceed with operation |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validate input and retry |
| 401 | Unauthorized | Refresh token or redirect to login |
| 409 | Conflict | Resource already exists (email/username) |
| 500 | Server Error | Show error message to user |

## Token Management

### Access Token
- Short-lived token (typically 15-30 minutes)
- Used for API requests
- Send in `Authorization` header
- Store in memory or localStorage

### Refresh Token
- Long-lived token (typically 7 days)
- Used to get new access tokens
- Store in httpOnly cookie (more secure)
- Should not be exposed to JavaScript if possible

### Best Practices
1. Store accessToken in memory during session
2. Store refreshToken in httpOnly cookie
3. Implement automatic token refresh before expiry
4. Clear tokens on logout
5. Redirect to login on 401 response

## CORS Configuration

Ensure your backend has CORS enabled for your frontend domain:

```javascript
// In your backend's app.js or config
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true
}));
```

## Cookie Handling

The API uses HTTP-only secure cookies. Ensure your frontend requests include:

```javascript
credentials: 'include' // in fetch
// or
withCredentials: true // in axios
```

## Testing the API

### cURL Examples

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User
curl -X GET http://localhost:3000/api/auth/get-me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Debugging Tips

1. **Check Network Tab** - View request/response in browser DevTools
2. **Console Logs** - Log API responses and errors
3. **Token Validation** - Decode JWT tokens at [jwt.io](https://jwt.io)
4. **CORS Issues** - Check browser console for CORS errors
5. **Token Expiry** - Implement token expiry handling

## Common Issues

### "Invalid token"
- Token has expired → refresh token
- Token format incorrect → check Bearer prefix
- Wrong secret key → verify backend configuration

### "Unauthorized"
- Missing Authorization header
- Token not included in request
- Protected route requires authentication

### "CORS Error"
- Frontend and backend on different origins
- Backend CORS not configured
- Credentials not included in requests

---

For more details, refer to the main [README.md](./README.md)
