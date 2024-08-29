const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
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
app.post('/uploads', upload.single('image'), (req, res) => {
    console.log(req.file);
  if (req.file) {
    res.json({ message: 'Image uploaded successfully', filePath: `/uploads/${req.file.filename}` });
  } else {
    console.log("Image upload failed")
    res.status(400).json({ message: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
