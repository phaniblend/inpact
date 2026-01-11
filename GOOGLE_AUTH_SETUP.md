# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the INPACT application.

## Prerequisites

- A Google Cloud Platform (GCP) account
- Access to the Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email` and `profile`
   - Add test users if needed (for development)
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `INPACT Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3001`
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback`
     - Your production callback URL (e.g., `https://api.yourdomain.com/api/auth/google/callback`)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Backend Environment Variables

1. Navigate to `backend/` directory
2. Create a `.env` file (or update existing one):
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   
   # Backend URL (for OAuth callback)
   BACKEND_URL=http://localhost:3001
   
   # Frontend URL (for redirect after auth)
   FRONTEND_URL=http://localhost:5173
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   
   # Other existing variables...
   OPENAI_API_KEY=your_openai_key
   PORT=3001
   ```

## Step 3: Install Dependencies

The required packages are already installed, but if you need to reinstall:

```bash
cd backend
npm install google-auth-library jsonwebtoken
```

## Step 4: Test the Setup

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login`
4. Click "Continue with Google"
5. You should be redirected to Google's sign-in page
6. After signing in, you'll be redirected back to the app

## Production Setup

For production, update the following:

1. **Google Cloud Console**:
   - Add your production domain to authorized origins
   - Add production callback URL

2. **Environment Variables**:
   ```env
   BACKEND_URL=https://api.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/auth/google/callback
   ```

3. **Security**:
   - Use a strong, random JWT_SECRET
   - Never commit `.env` files to version control
   - Use environment variables in your hosting platform

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Console exactly matches the one in your `.env` file
- Check for trailing slashes and protocol (http vs https)

### "Invalid client" error
- Verify your Client ID and Client Secret are correct
- Check that the OAuth consent screen is properly configured

### Token verification fails
- Ensure JWT_SECRET is set correctly
- Check that tokens are being stored in localStorage

## Architecture

The authentication flow works as follows:

1. User clicks "Sign in with Google" on frontend
2. Frontend requests auth URL from backend (`/api/auth/google`)
3. Backend returns Google OAuth URL
4. User is redirected to Google sign-in
5. Google redirects to backend callback (`/api/auth/google/callback`)
6. Backend exchanges code for user info
7. Backend creates/finds user and generates JWT token
8. Backend redirects to frontend with token and user data
9. Frontend stores token and user data in localStorage
10. User is authenticated

## Notes

- User data is currently stored in-memory (backend). For production, integrate with a database.
- JWT tokens expire after 7 days
- The auth context automatically verifies tokens on app load

