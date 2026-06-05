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
    globalWithMongoose._mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiq', {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        globalWithMongoose._mongoose.conn = mongooseInstance
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`)
        return mongooseInstance
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`)
        process.exit(1)
      })
  }

  return globalWithMongoose._mongoose.promise
}

export default connectDB