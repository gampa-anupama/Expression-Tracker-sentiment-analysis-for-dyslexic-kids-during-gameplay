const mongoose = require('mongoose');

const uri = 'mongodb+srv://anupamagampa:Anu456%40%2A@cluster0.tk7wg.mongodb.net/Data_Analysis?retryWrites=true&w=majority';

const connectToDB = async () => {
  try {
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Adjust as needed
      socketTimeoutMS: 45000, // Adjust as needed
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectToDB;
