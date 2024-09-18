// const mongoose = require('mongoose');

// const analysisSchema = new mongoose.Schema({
//   imageName: { type: String, required: true },
//   analysisResult: { type: Object, required: true }, // Use the correct type based on the response
// });

// const Analysis = mongoose.model('Analysis', analysisSchema);

// module.exports = Analysis;

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  analysisResult: { type: Object, required: true }, // Use the correct type based on the response
  sessionId: { type: String, required: true }, // New field for session ID
}, { timestamps: true }); // Optional: Add timestamps for createdAt and updatedAt

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
