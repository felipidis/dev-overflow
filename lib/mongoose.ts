import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined')
  }

  if (isConnected) {
    return console.log('MongoDB is already connected')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'DevOverflow'
    })

    isConnected = true
    console.log('MongoDB is connected')
  } catch (error) {
    console.log('MongoDB connection failed', error)
  }
}
