import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Google OAuth2 Client
// Backend callback URL (this endpoint handles the OAuth callback)
const BACKEND_CALLBACK_URL = process.env.BACKEND_URL 
  ? `${process.env.BACKEND_URL}/api/auth/google/callback`
  : 'http://localhost:3001/api/auth/google/callback';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  BACKEND_CALLBACK_URL
);

// JWT Secret (use a strong secret in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// In-memory user store (replace with database in production)
let users = [];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper function to find or create user
const findOrCreateUser = (email, name, picture, authProvider = 'google') => {
  let user = users.find(u => u.email === email);
  
  if (!user) {
    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      picture,
      authProvider,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    console.log('Created new user:', user.id, user.email);
  } else {
    // Update user info if needed
    user.name = name || user.name;
    user.picture = picture || user.picture;
    user.authProvider = authProvider;
    console.log('Found existing user:', user.id, user.email);
  }
  
  return user;
};

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow
 */
router.get('/google', (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    prompt: 'consent'
  });
  
  res.json({ success: true, authUrl });
});

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code not provided' 
      });
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user
    const user = findOrCreateUser(email, name, picture, 'google');

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

/**
 * POST /api/auth/verify
 * Verifies JWT token
 */
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token not provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal, but we can track here if needed)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
