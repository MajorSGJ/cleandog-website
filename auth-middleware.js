import crypto from 'crypto'

// Admin credentials from defaultData
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD_HASH = '2fcd713601248122263e5ef1b46ef751a5c7d0a7f02dd915b8b180eb8ed18b4c' // LU**%&d3

// Session storage (in production, use Redis or database)
const sessions = new Map()

// SHA-256 hash function
const sha256 = (message) => {
  return crypto.createHash('sha256').update(message).digest('hex')
}

// Generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Authentication middleware
export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const session = sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
  
  // Refresh session expiry
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  req.user = session.user
  next()
}

// Login endpoint
export const login = (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }
  
  const passwordHash = sha256(password)
  
  if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
    const token = generateSessionToken()
    sessions.set(token, {
      user: { username },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
    
    res.json({ 
      success: true, 
      token,
      user: { username }
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}

// Logout endpoint
export const logout = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (token) {
    sessions.delete(token)
  }
  
  res.json({ success: true })
}

// Check auth status
export const checkAuth = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.json({ authenticated: false })
  }
  
  const session = sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token)
    return res.json({ authenticated: false })
  }
  
  res.json({ 
    authenticated: true,
    user: session.user
  })
}

// Clean up expired sessions (run periodically)
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token)
    }
  }
}, 60 * 60 * 1000) // Clean up every hour
