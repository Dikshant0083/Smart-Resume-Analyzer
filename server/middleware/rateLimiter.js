// Simple rate limiter middleware
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100 // limit each IP to 100 requests per windowMs
  } = options

  const requests = new Map()

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    
    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (now - value.start > windowMs) {
        requests.delete(key)
      }
    }

    const requestCount = requests.get(ip)?.count || 0
    
    if (requestCount >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      })
    }

    if (!requests.has(ip)) {
      requests.set(ip, { start: now, count: 1 })
    } else {
      requests.get(ip).count++
    }

    next()
  }
}

export default rateLimit