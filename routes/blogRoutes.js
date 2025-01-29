import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

const router = express.Router();

// Routes for blogs
router.post('/', createBlog); // Create blog
router.get('/', getAllBlogs); // Get all blogs
router.get('/:id', getBlogById); // Get blog by ID
router.put('/:id', updateBlog); // Update blog
router.delete('/:id', deleteBlog); // Delete blog

export default router;
