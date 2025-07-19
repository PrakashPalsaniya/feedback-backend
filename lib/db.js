const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://prakash8290682001:HDCDOL1cpmxVYSuo@cluster0.xs7spfb.mongodb.net/feedback?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

module.exports= connectDB;