import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  toggleFavoriteDestination,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/favorites/:destinationId', protect, toggleFavoriteDestination);

export default router;
