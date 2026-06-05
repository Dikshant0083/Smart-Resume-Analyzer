import mongoose from 'mongoose'

const globalWithMongoose = globalThis

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (globalWithMongoose._mongoose.conn) {
    return globalWithMongoose._mongoose.conn
  }

  if (!globalWithMongoose._mongoose.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiq'

    globalWithMongoose._mongoose.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // fail fast — 10s instead of 300s
        connectTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        globalWithMongoose._mongoose.conn = mongooseInstance
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`)
        return mongooseInstance
      })
      .catch((error) => {
        // Reset promise so next request retries
        globalWithMongoose._mongoose.promise = null
        console.error(`MongoDB Connection Error: ${error.message}`)
        throw error // throw — never process.exit() in serverless
      })
  }

  return globalWithMongoose._mongoose.promise
}

export default connectDB