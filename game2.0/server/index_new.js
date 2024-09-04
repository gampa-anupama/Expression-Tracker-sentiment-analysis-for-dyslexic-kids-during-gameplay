const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
// const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// Dynamically import node-fetch
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();


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
    const filePath = path.join(__dirname, 'uploads', req.file.filename); // Create absolute path
    res.json({ message: 'Image uploaded successfully', filePath: `/uploads/${req.file.filename}` });
    query(filePath).then((response) => {
      console.log(JSON.stringify(response));
    });
  } else {
    console.log("Image upload failed")
    res.status(400).json({ message: 'Upload failed' });
  }
});

// code to call api

//const fetch = require('node-fetch'); // Ensure you have node-fetch installed

async function query(filename) {
  console.log("query method invoked");
	//const data = fs.readFileSync(filename);
  const form =new FormData();
  form.append('file', fs.createReadStream(filename)); // Use the filename passed to the function
  console.log("Data taken as file name ")
  try{
  //const data = fs.readFileSync(filePath);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
		{
			headers: {
				Authorization: "Bearer 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",
			},
			method: "POST",
			body: form,
		}
    
	);

  console.log(" fetched");
	const result = await response.json();
	return result;
}
catch(error){
  console.error('Error reading or processing the file:', error);
    throw error;
}
}




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});