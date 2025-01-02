import express from 'express';
import upload from '../middlewares/multerConfig.js';
import parseUploadFolder from '../middlewares/parseUploadFolder.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();


// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Route: Upload Owner Images (Default folder)
router.post('/upload-owner-images', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const filePaths = req.files.map((file) => file.path); // Map uploaded file paths
  res.status(200).json({
    message: 'Files uploaded successfully!',
    imagePaths: filePaths,
  });
});

// Route: Upload commerical Images (Default folder)
// Route: Upload Commercial Images (specific to commercialimage folder)
router.post('/upload-commercial-images', (req, res) => {
  const uploadFolder = 'files/commercialimage'; // Specify the commercial folder
  const uploadPath = path.join(__dirname, '..', uploadFolder);

  // Ensure directory exists
  ensureDirectoryExists(uploadPath);

  // Dynamically set multer storage for commercial images
  const commercialStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath); // Upload to the commercialimage folder
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to filenames
    },
  });

  const commercialUpload = multer({ storage: commercialStorage }).array('images', 10);

  commercialUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Server error.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const filePaths = req.files.map((file) => file.path);
    res.status(200).json({
      message: 'Files uploaded successfully!',
      uploadFolder,
      imagePaths: filePaths,
    });
  });
});


// Route: Upload to Custom Directory
router.post('/upload', (req, res) => {
  // Retrieve the upload folder from the request body or default to 'files/ownproimages'
  const uploadFolder = req.body.uploadFolder?.trim() || 'files/ownproimages';
  console.log('Parsed uploadFolder:', uploadFolder);

  // Resolve the full path for the upload folder
  const uploadPath = path.join(__dirname, '..', uploadFolder);

  // Ensure the directory exists
  ensureDirectoryExists(uploadPath);
  console.log('Resolved Upload Path:', uploadPath);

  // Dynamic storage configuration for multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dynamicUploadFolder = req.body.uploadFolder?.trim() || 'files/ownproimages';
      const dynamicUploadPath = path.join(__dirname, '..', dynamicUploadFolder);

      ensureDirectoryExists(dynamicUploadPath); // Ensure directory exists dynamically
      console.log('Dynamic Upload Path:', dynamicUploadPath); // Debugging
      cb(null, dynamicUploadPath); // Set dynamic path
    },
    filename: (req, file, cb) => {
      // Save the file with a timestamp prefix
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage }).array('files', 10); // Support multiple files

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  
    console.log('Received body:', req.body); // Debugging
    console.log('Uploaded files:', req.files); // Debugging
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }
  
    // Dynamically use the uploadFolder value from the request body
    const uploadFolder = req.body.uploadFolder?.trim() || 'files/ownproimages';
  
    // Map the file paths
    const filePaths = req.files.map((file) => file.path);
  
    // Send the correct response
    res.status(200).json({
      message: 'Files uploaded successfully!',
      uploadFolder, // Dynamic folder
      filePaths,    // File paths
    });
  });
  
});






export default router;
