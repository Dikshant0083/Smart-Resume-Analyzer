import mongoose from 'mongoose'

const globalWithMongoose = globalThis

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  // Return cached connection if available
  if (globalWithMongoose._mongoose.conn) {
    return globalWithMongoose._mongoose.conn
  }

  // Start new connection if no pending promise
  if (!globalWithMongoose._mongoose.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiq'

    globalWithMongoose._mongoose.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      // bufferCommands: true (default) — allow queries to queue while connecting
    })
    .then((mongooseInstance) => {
      globalWithMongoose._mongoose.conn = mongooseInstance
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`)
      return mongooseInstance
    })
    .catch((error) => {
      globalWithMongoose._mongoose.promise = null
      console.error(`MongoDB Connection Error: ${error.message}`)
      throw error
    })
  }

  // Await the pending connection
  return globalWithMongoose._mongoose.promise
}

export default connectDB