const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or local connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://rabeb27677:aditiparashar@cluster2222.2kk4t.mongodb.net/tiffin-service?retryWrites=true&w=majority&appName=Cluster2222';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;