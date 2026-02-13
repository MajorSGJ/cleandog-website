import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { authenticateAdmin, login, logout, checkAuth } from './auth-middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001
const DATA_FILE = path.join(__dirname, 'public', 'data.json')

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.web3forms.com"]
    }
  }
}))

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
})

// Stricter rate limiting for form submission
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 form submissions per hour
  message: { error: 'Form submission limit exceeded. Please try again later.' }
})

app.use(limiter)
app.use(express.json({ limit: '5mb' }))

// Save data - called by admin panel (protected)
app.post('/api/save', authenticateAdmin, (req, res) => {
  try {
    // Basic validation
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid data format' })
    }
    
    // Sanitize data to prevent code injection
    const sanitizedData = JSON.parse(JSON.stringify(req.body))
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(sanitizedData, null, 2), 'utf8')
    res.json({ ok: true })
  } catch (err) {
    console.error('Save error:', err)
    res.status(500).json({ ok: false, error: 'Failed to save data' })
  }
})

// Contact form endpoint - proxy to Web3Forms
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    
    // Get Web3Forms key from environment
    const web3formsKey = process.env.WEB3FORMS_KEY
    if (!web3formsKey) {
      return res.status(500).json({ error: 'Form service not configured' })
    }
    
    // Send to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject: `Nowa wiadomość z Clean Dog - ${name}`,
        from_name: name,
        email: email,
        phone: phone || '',
        message: message,
        to_email: 'Daria@cleandog.pl'
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      res.json({ success: true })
    } else {
      res.status(400).json({ error: 'Failed to send message' })
    }
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Authentication endpoints
app.post('/api/login', login)
app.post('/api/logout', logout)
app.get('/api/auth/check', checkAuth)

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
