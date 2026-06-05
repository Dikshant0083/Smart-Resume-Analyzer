import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'resumeiq-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'resumeiq-secret-key')
}

export { generateToken, verifyToken }