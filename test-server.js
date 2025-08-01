const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Test auth route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple test authentication
  if (email === 'test@example.com' && password === 'password') {
    res.json({
      token: 'test-token-123',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User'
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Test registration route
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  res.status(201).json({
    token: 'test-token-456',
    user: {
      id: '2',
      email,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 