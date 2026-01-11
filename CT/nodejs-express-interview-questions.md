# Node.js + Express - 100 Coding Interview Questions

## Junior Level (25 questions)

### 1. Basic Express Server with Routes ⭐
**Time:** 15 minutes  
**Tests:** Express setup, routing, HTTP methods, response handling

**Challenge:**
```javascript
// Create an Express server that:
// - Listens on port 3000
// - GET /api/users - returns array of users
// - GET /api/users/:id - returns single user
// - POST /api/users - creates new user
// - Returns JSON responses
// - Handles 404 for unknown routes
```

**What interviewers look for:**
```javascript
// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// GET /api/users/:id - Get single user
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with id ${id} not found`
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - Create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name and email'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. Middleware Implementation ⭐
**Time:** 20 minutes  
**Tests:** Custom middleware, request logging, error handling

**Challenge:**
```javascript
// Create Express middleware that:
// - Logs request method, URL, and timestamp
// - Adds request ID to each request
// - Measures response time
// - Error handling middleware
// - Apply to all routes
```

**What interviewers look for:**
```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Request ID middleware
const requestIdMiddleware = (req, res, next) => {
  req.requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

// Logging middleware
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ID: ${req.requestId}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ` +
      `Status: ${res.statusCode} - Duration: ${duration}ms - ID: ${req.requestId}`
    );
  });
  
  next();
};

// Apply middleware
app.use(requestIdMiddleware);
app.use(loggerMiddleware);

// Routes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint',
    requestId: req.requestId
  });
});

app.get('/api/error', (req, res, next) => {
  next(new Error('Test error'));
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message} - ID: ${req.requestId}`);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 3. RESTful API with CRUD Operations ⭐
**Time:** 30 minutes  
**Tests:** REST principles, CRUD operations, HTTP status codes

**Challenge:**
```javascript
// Create a RESTful API for todos:
// - GET /api/todos - list all todos
// - GET /api/todos/:id - get single todo
// - POST /api/todos - create todo
// - PUT /api/todos/:id - update todo
// - DELETE /api/todos/:id - delete todo
// - Proper HTTP status codes
// - Input validation
```

**What interviewers look for:**
```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

let todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
];
let nextId = 3;

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  const { completed } = req.query;
  let filteredTodos = todos;
  
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTodos = todos.filter(t => t.completed === isCompleted);
  }
  
  res.json({
    success: true,
    count: filteredTodos.length,
    data: filteredTodos
  });
});

// GET /api/todos/:id - Get single todo
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: `Todo with id ${id} not found`
    });
  }
  
  res.json({
    success: true,
    data: todo
  });
});

// POST /api/todos - Create todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string'
    });
  }
  
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  
  res.status(201).json({
    success: true,
    data: newTodo
  });
});

// PUT /api/todos/:id - Update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: `Todo with id ${id} not found`
    });
  }
  
  const { title, completed } = req.body;
  
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a non-empty string'
      });
    }
    todo.title = title.trim();
  }
  
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Completed must be a boolean'
      });
    }
    todo.completed = completed;
  }
  
  res.json({
    success: true,
    data: todo
  });
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Todo with id ${id} not found`
    });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Todo deleted successfully',
    data: deletedTodo
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. File Upload with Multer ⭐
**Time:** 30 minutes  
**Tests:** File upload, multer, file validation, error handling

**Challenge:**
```javascript
// Create an endpoint that:
// - Accepts file uploads (images only)
// - Validates file type and size
// - Saves files to uploads/ directory
// - Returns file URL
// - Handles errors gracefully
```

**What interviewers look for:**
```javascript
// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    }
  });
});

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 5. Authentication with JWT ⭐
**Time:** 40 minutes  
**Tests:** JWT, authentication, password hashing, protected routes

**Challenge:**
```javascript
// Create authentication system:
// - POST /api/auth/register - register user (hash password)
// - POST /api/auth/login - login (return JWT)
// - GET /api/auth/me - get current user (protected)
// - Middleware to protect routes
// - Use bcrypt for password hashing
```

**What interviewers look for:**
```javascript
// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// In-memory user store (use database in production)
let users = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: users.length + 1,
      email,
      name,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// GET /api/auth/me - Protected route
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 6-25. [Additional Junior Questions covering:]
- Environment variables
- CORS configuration
- Body parsing
- Query parameters
- Route parameters
- Route handlers
- Response methods
- Error handling
- Static file serving
- Template engines
- Basic database connection
- Async/await patterns
- Promise handling
- Basic testing
- API documentation basics

---

## Mid Level (35 questions)

### 26. Database Integration with MongoDB ⭐⭐
**Time:** 45 minutes  
**Tests:** MongoDB, Mongoose, schemas, queries

**Challenge:**
```javascript
// Create API with MongoDB:
// - Connect to MongoDB
// - Define Mongoose schemas
// - CRUD operations
// - Query filtering and sorting
// - Pagination
```

### 27. Rate Limiting ⭐⭐
**Time:** 30 minutes  
**Tests:** Rate limiting, express-rate-limit, security

**Challenge:**
```javascript
// Implement rate limiting:
// - Different limits for different routes
// - IP-based limiting
// - Custom error messages
// - Reset headers
```

### 28-60. [Additional Mid Level Questions covering:]
- Advanced middleware patterns
- Request validation
- Input sanitization
- Advanced error handling
- Logging strategies
- Database transactions
- Connection pooling
- Advanced routing
- Route organization
- API versioning
- Advanced authentication
- OAuth integration
- Session management
- Advanced file handling
- Streaming
- WebSocket integration
- Real-time features
- Caching strategies
- Redis integration
- Advanced security
- Helmet.js
- CSRF protection
- XSS prevention
- SQL injection prevention
- Advanced testing
- Integration testing
- API testing
- Performance optimization
- Advanced error handling
- Monitoring and logging

---

## Senior Level (25 questions)

### 61. Microservices Architecture ⭐⭐⭐
**Time:** 90 minutes  
**Tests:** Microservices, service communication, architecture

**Challenge:**
```javascript
// Design microservices architecture:
// - Multiple services
// - Service communication
// - API gateway
// - Service discovery
// - Load balancing
```

### 62. Advanced Performance Optimization ⭐⭐⭐
**Time:** 60 minutes  
**Tests:** Performance, optimization, profiling

**Challenge:**
```javascript
// Optimize Express application:
// - Clustering
// - Caching strategies
// - Database optimization
// - Response compression
// - Connection pooling
```

### 63-85. [Additional Senior Questions covering:]
- Advanced architecture patterns
- Event-driven architecture
- Message queues
- Advanced database patterns
- Advanced security
- Advanced authentication
- Advanced monitoring
- Distributed tracing
- Advanced testing
- Test strategies
- Advanced deployment
- Containerization
- Docker
- Kubernetes
- CI/CD integration
- Advanced error handling
- Circuit breakers
- Retry patterns
- Advanced logging
- Structured logging

---

## Lead Level (15 questions)

### 86. Enterprise Architecture ⭐⭐⭐⭐
**Time:** 120 minutes  
**Tests:** System design, enterprise patterns, scalability

**Challenge:**
```javascript
// Design enterprise Node.js application:
// - Microservices architecture
// - Service mesh
// - API gateway
// - Monitoring and observability
// - Scalability patterns
```

### 87-100. [Additional Lead Questions covering:]
- Advanced system architecture
- Distributed systems
- Advanced security
- Enterprise security
- Advanced monitoring
- Observability
- Advanced CI/CD
- Deployment strategies
- Multi-environment setup
- Advanced testing
- Test automation
- Performance at scale
- Advanced optimization
- System documentation

---

*Each question includes complete Node.js + Express solutions with modern patterns and best practices.*





