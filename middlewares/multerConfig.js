import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directory exists
const imagesDirectory = 'public/images';
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true });
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Define your uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define the file naming convention
  },
});

const upload = multer({ storage: storage });

export default upload;
