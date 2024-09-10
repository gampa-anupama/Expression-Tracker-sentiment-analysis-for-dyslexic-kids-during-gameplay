const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectToDB = require('./db'); // Import the connectToDB function
const Analysis = require('./schema'); // Import the Analysis model

let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

const app = express();
app.use(express.json());
app.use(express.static('uploads'));

// Multer setup for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route for handling image upload
app.post('/uploads', upload.single('image'), async (req, res) => {
  if (req.file) {
    const filePath = path.join(__dirname, 'uploads', req.file.filename); // Create absolute path
    res.json({ message: 'Image uploaded successfully', filePath: `/uploads/${req.file.filename}` });
    try {
      const result = await query(filePath);
      console.log(JSON.stringify(result));
      await saveAnalysisResult(req.file.filename, result); // Save the result to MongoDB
    } catch (error) {
      console.error('Error processing the file:', error);
      res.status(500).json({ message: 'Processing failed' });
    }
  } else {
    res.status(400).json({ message: 'Upload failed' });
  }
});

// Function to fetch analysis from Hugging Face API
async function query(filename) {
  const imageData = fs.readFileSync(filename); // Read image file as binary data
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: imageData,
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
}

// Function to save analysis result to MongoDB
async function saveAnalysisResult(imageName, result) {
  try {
    const newAnalysis = new Analysis({
      imageName: imageName,
      analysisResult: result,
    });
    await newAnalysis.save();
    console.log('Analysis result saved to MongoDB');
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    throw error;
  }
}

// Connect to MongoDB and start the server
(async () => {
  try {
    await connectToDB(); // Establish the MongoDB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
})();
