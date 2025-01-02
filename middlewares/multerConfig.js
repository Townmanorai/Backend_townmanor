import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create directory recursively
  }
};

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = req.body.uploadFolder || 'files/ownproimages'; // Default to 'files/ownproimages'
    const uploadPath = path.join(__dirname, '..', uploadFolder);
    ensureDirectoryExists(uploadPath); // Ensure directory exists
    // console.log('Uploading to:', uploadPath); // Log the upload path
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save with timestamp
  },
});


// Configure multer
const upload = multer({ storage });

export default upload;




// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Ensure the directory exists
// const imagesDirectory = 'public/images';
// if (!fs.existsSync(imagesDirectory)) {
//   fs.mkdirSync(imagesDirectory, { recursive: true });
// }

// // Set up storage for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images'); // Define your uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file naming convention
//   },
// });

// const upload = multer({ storage: storage });

// export default upload;
