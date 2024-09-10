const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  analysisResult: { type: Object, required: true }, // Use the correct type based on the response
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
