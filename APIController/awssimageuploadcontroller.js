import express from 'express';
import multer from 'multer';
import s3 from '../config/aws.js'; // Import S3 configuration
import path from 'path';

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Use memory storage for S3 uploads
const upload = multer({ storage });

// Upload endpoint
router.post('/upload-to-s3', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = req.file.buffer;
    const fileName = `${Date.now()}-${path.basename(req.file.originalname)}`;

    // S3 upload parameters
    const params = {
      Bucket: 'townamnor.ai', 
      Key: fileName,
      Body: fileContent,
      // ACL: 'public-read', 
      ContentType: req.file.mimetype,
    };

    // Upload to S3
    const data = await s3.upload(params).promise();

    res.status(200).json({
      message: 'File uploaded successfully!',
      fileUrl: data.Location, // Public URL of the file
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});


// Route: Upload Owner Images (Uploads to 'owner-images' folder in S3)
router.post('/aws-upload-owner-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFiles = await Promise.all(req.files.map(async (file) => {
      const fileContent = file.buffer;
      const fileName = `owner-images/${Date.now()}-${path.basename(file.originalname)}`; // Define folder structure in S3

      const params = {
        Bucket: 'townamnor.ai', // Your S3 bucket name
        Key: fileName, // Upload path (including the folder)
        Body: fileContent,
        ContentType: file.mimetype,
      };

      const data = await s3.upload(params).promise(); // Upload to S3
      return data.Location; // Return the S3 URL of the uploaded file
    }));

    res.status(200).json({
      message: 'Files uploaded successfully!',
      fileUrls: uploadedFiles, // List of URLs of uploaded files
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Route: Upload Commercial Images (Uploads to 'commercial-images' folder in S3)
router.post('/aws-upload-commercial-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFiles = await Promise.all(req.files.map(async (file) => {
      const fileContent = file.buffer;
      const fileName = `commercial-images/${Date.now()}-${path.basename(file.originalname)}`; // Define folder structure in S3

      const params = {
        Bucket: 'townamnor.ai', // Your S3 bucket name
        Key: fileName, // Upload path (including the folder)
        Body: fileContent,
        ContentType: file.mimetype,
      };

      const data = await s3.upload(params).promise(); // Upload to S3
      return data.Location; // Return the S3 URL of the uploaded file
    }));

    res.status(200).json({
      message: 'Files uploaded successfully!',
      fileUrls: uploadedFiles, // List of URLs of uploaded files
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Route: Upload to Custom Directory (Dynamic folder name from request body)
router.post('/aws-upload', upload.array('files', 10), async (req, res) => {
  try {
    const uploadFolder = req.body.uploadFolder?.trim() || 'ownproimages'; // Default folder name if not provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFiles = await Promise.all(req.files.map(async (file) => {
      const fileContent = file.buffer;
      const fileName = `${uploadFolder}/${Date.now()}-${path.basename(file.originalname)}`; // Folder structure based on request

      const params = {
        Bucket: 'townamnor.ai', // Your S3 bucket name
        Key: fileName, // Upload path (including the folder)
        Body: fileContent,
        ContentType: file.mimetype,
      };

      const data = await s3.upload(params).promise(); // Upload to S3
      return data.Location; // Return the S3 URL of the uploaded file
    }));

    res.status(200).json({
      message: 'Files uploaded successfully!',
      fileUrls: uploadedFiles, // List of URLs of uploaded files
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

export default router;
