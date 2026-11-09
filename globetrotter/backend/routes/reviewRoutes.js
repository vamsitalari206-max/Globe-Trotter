import express from 'express';
import {
  getDestinationReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:destinationId', getDestinationReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
