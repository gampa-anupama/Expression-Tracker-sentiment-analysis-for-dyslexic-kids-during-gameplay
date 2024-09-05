// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');// cors- corss-origin Resource sharing 
// // cors allows the frontentend to make requests to the backend
// const axios = require('axios');
// const FormData = require('form-data');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static('uploads'));

// // Multer setup for storing images
// // multer.diskStorage is function that configures where and how the files should be saved
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// // in storage we are having the filename of the photo that is going to get stored in uploads 
// // by changing the code in storage we can coustize how we want the name of the file to be in the 
// // uploads
// const upload = multer({ storage: storage });
// // multer takes the storage as input and stores the photo in uplaods in the name of storage
// // Route for handling image upload



// app.post('/uploads', upload.single('image'), async(req, res) => {
//     console.log(req.file);
//   if (req.file) {
//     try {
//       // Path of the uploaded image
//       const imagePath = path.join(__dirname, 'uploads', upload);

//       // Send the image to the Hugging Face model for facial expression recognition
//       const formData = {
//         file: {
//           value: require('fs').createReadStream(imagePath),
//           options: {
//             filename: upload,
//             contentType: 'image/jpeg', // Adjust according to the file type
//           },
//         },
//       };

//       // Make a POST request to the Hugging Face API
//       const data = fs.readFileSync(filename);
//       const response = await axios.post(
//         "https://api-inference.huggingface.co/models/trpakov/vit-face-expression", // Your model URL
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer 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`, // Replace with your Hugging Face API key
//             'Content-Type': 'mapplication/json',
//           },
//           method: "POST",
// 			    body: data,
//         }
//       );

//       // Store the analysis result (for example, in a variable or database)
//       const analysisResult = response.data;
//       console.log('Facial Expression Analysis:', analysisResult);

//       // Send the result back to the client
//       res.json({
//         message: 'Image uploaded and analyzed successfully',
//         filePath: `/uploads/${req.file.filename}`,
//         analysis: analysisResult, // Return analysis results to frontend
//       });
//     } catch (error) {
//       console.error('Error analyzing image:', error);
//       res.status(500).json({ message: 'Error analyzing image', error });
//     }
//     //res.json({ message: 'Image uploaded successfully', filePath: `/uploads/${req.file.filename}` });
//   } else {
//     console.log("Image upload failed")
//     res.status(400).json({ message: 'Upload failed' });
//   }
// });



// // above block of code is for error handling knowing wether the file is successfully
// // uploaded in the uploads or not
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// // this is the compulsory code 
// // why it is placed in the last? All your middleware, routes, and other 
// // configurations (e.g., handling file uploads, processing requests)
// //  need to be in place before the server starts listening for requests. 
// //  Otherwise, the server would start before it knows how to handle any
// //   incoming request, which could lead to errors.


const express = require('express'); 
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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
  //destination: Specifies the folder where files will be saved (uploads).
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  // filename: Specifies how the filename will be determined.
  //  In this case, it uses the current timestamp plus the original file extension.
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// upload: This initializes Multer with the storage configuration defined above.
//  This upload variable will be used in routes to handle file uploads.
const upload = multer({ storage: storage });

// Route for handling image upload
app.post('/uploads', upload.single('image'), (req, res) => {
  // prints the details abt the file on console
  console.log(req.file);
   if (req.file) {
    /// creating the absolute path of the image uploaded to give to the query func as parameter
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

async function query(filename) {
  console.log("query method invoked");
  // reads image file as a binary data form the file system
  const imageData= fs.readFileSync(filename);
  console.log("Data taken as file name ")
  try{
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


