import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} from '../controllers/articleController.js';

const router = express.Router();

// Routes for articles
router.post('/', createArticle); // Create article
router.get('/', getAllArticles); // Get all articles
router.get('/:id', getArticleById); // Get article by ID
router.put('/:id', updateArticle); // Update article
router.delete('/:id', deleteArticle); // Delete article

export default router;
