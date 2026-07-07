import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMe, updateMe, getUserById, getUserPosts } from '../controllers/users.controller';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

export default router;