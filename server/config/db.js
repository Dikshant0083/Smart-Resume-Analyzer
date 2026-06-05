import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiq'

const connectDB = async () => {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState

  if (state === 1) {
    return mongoose.connection // already connected and alive
  }

  // If previous connection is in a bad state, disconnect cleanly first
  if (state !== 0) {
    try {
      await mongoose.disconnect()
    } catch (_) {}
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000, // fail fast if Atlas is unreachable
    socketTimeoutMS: 30000,          // fail fast if query hangs (not 300s)
    connectTimeoutMS: 15000,
    bufferCommands: false,           // don't buffer — fail immediately on bad connection
    maxPoolSize: 1,                  // single connection for serverless
    minPoolSize: 0,
    retryWrites: true,
  })

  console.log(`MongoDB Connected: ${mongoose.connection.host}`)
  return mongoose.connection
}

export default connectDB