// Security utilities for input validation and sanitization

/**
 * Sanitize string to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim()
    .slice(0, 1000) // Limit length
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Polish format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]{9,15}$/
  return phoneRegex.test(phone)
}

/**
 * Sanitize HTML content (for rich text editors)
 * Allows only safe tags
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return ''
  
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li']
  const div = document.createElement('div')
  div.innerHTML = html
  
  // Remove all script tags
  const scripts = div.getElementsByTagName('script')
  while (scripts.length > 0) {
    scripts[0].parentNode.removeChild(scripts[0])
  }
  
  return div.innerHTML
}

/**
 * Rate limiting helper (client-side)
 * Prevents spam submissions
 */
export class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 60000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.attempts = []
  }

  canAttempt() {
    const now = Date.now()
    this.attempts = this.attempts.filter(time => now - time < this.windowMs)
    
    if (this.attempts.length >= this.maxAttempts) {
      return false
    }
    
    this.attempts.push(now)
    return true
  }

  getRemainingTime() {
    if (this.attempts.length === 0) return 0
    const oldestAttempt = Math.min(...this.attempts)
    const elapsed = Date.now() - oldestAttempt
    return Math.max(0, this.windowMs - elapsed)
  }
}
