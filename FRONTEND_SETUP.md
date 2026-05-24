# Frontend Setup & Usage Guide

Step-by-step guide to set up your frontend application to work with the Auth Backend.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Frontend framework (React, Vue, Svelte, etc.)
- Basic understanding of HTTP requests

## Quick Setup

### 1. Initialize Frontend Project

```bash
# Using Create React App
npx create-react-app my-auth-frontend

# Or using Vite (Recommended)
npm create vite@latest my-auth-frontend -- --template react

# Or using Vue
npm create vite@latest my-auth-frontend -- --template vue

# Navigate to project
cd my-auth-frontend
```

### 2. Install Dependencies

```bash
npm install axios
npm install -D tailwindcss postcss autoprefixer  # Optional
```

### 3. Configure Backend URL

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:3000/api/auth
# OR for Vite:
VITE_API_URL=http://localhost:3000/api/auth
```

### 4. Set Up API Client

Create `src/api/client.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/auth';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.get(`${API_URL}/refresh-token`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
```

## Authentication Service

Create `src/services/authService.js`:

```javascript
import client from '../api/client';

export const authService = {
  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await client.post('/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await client.post('/login', { email, password });
      const { accessToken, refreshToken } = response.data.tokens;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify email with OTP
  verifyEmail: async (email, otp) => {
    try {
      const response = await client.post('/verify-email', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request OTP
  requestOTP: async (email) => {
    try {
      const response = await client.post('/verify-email', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await client.get('/get-me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      await client.get('/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await client.get('/logout-all');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await client.get('/refresh-token', {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get token
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken')
};
```

## React Context Setup

Create `src/context/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const { user } = await authService.getCurrentUser();
          setUser(user);
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(username, email, password);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.verifyEmail(email, otp);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    isAuthenticated: authService.isAuthenticated()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Usage in Components

### Login Component

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Register Component

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      alert('Registration successful! Please verify your email.');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Protected Route Component

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

### Dashboard Component

```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
      <p>Verified: {user?.verified ? 'Yes' : 'No'}</p>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js           # Axios client setup
│   ├── services/
│   │   └── authService.js      # Auth API methods
│   ├── context/
│   │   └── AuthContext.jsx     # Auth context provider
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── NavBar.jsx
│   ├── App.jsx                 # Main app component
│   └── main.jsx
├── .env.local                  # Environment variables
├── package.json
└── vite.config.js
```

## Environment Variables

### .env.local

```env
VITE_API_URL=http://localhost:3000/api/auth
VITE_DEBUG=true
```

### .env.production

```env
VITE_API_URL=https://api.example.com/api/auth
VITE_DEBUG=false
```

## Testing API Endpoints

### Using Postman

1. Import API collection from Postman
2. Set `base_url` variable to `http://localhost:3000/api/auth`
3. Create requests for each endpoint
4. Use environment variables for tokens

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/get-me \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### CORS Error
**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
1. Ensure backend CORS is configured
2. Use `withCredentials: true` in requests
3. Check frontend URL matches backend CORS config

### Token Expired
**Problem:** "401 Unauthorized"

**Solution:**
1. Refresh token automatically (interceptor handles this)
2. If refresh also fails, redirect to login
3. Clear localStorage tokens

### Network Error
**Problem:** "Network Error" or "Cannot reach backend"

**Solution:**
1. Verify backend is running on port 3000
2. Check API URL in environment variables
3. Check browser console for detailed error
4. Use curl to test backend endpoint directly

## Production Deployment

### Before Deploying

1. Update `VITE_API_URL` to production backend URL
2. Set `NODE_ENV=production`
3. Run build: `npm run build`
4. Test production build locally
5. Update CORS settings on backend

### Deployment Checklist

- [ ] API URL is correct
- [ ] SSL/HTTPS is enabled
- [ ] CORS is configured for production domain
- [ ] Environment variables are set
- [ ] Tokens have appropriate expiry times
- [ ] Error handling is in place
- [ ] Logging is configured
- [ ] Security headers are set

---

## Next Steps

1. Set up routing (React Router)
2. Add form validation
3. Implement proper error handling
4. Add loading states
5. Style components
6. Add tests
7. Deploy frontend
8. Configure CI/CD

---

For more details, see:
- [Frontend Integration Guide](./FRONTEND_INTEGRATION.md)
- [API Documentation](./FRONTEND_API.md)
- [Backend README](./README.md)
