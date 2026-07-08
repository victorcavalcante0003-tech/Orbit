import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createPost, getPostById, deletePost, getFeed } from '../controllers/posts.controller';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/feed', authMiddleware, getFeed);
router.get('/:id', getPostById);
router.delete('/:id', authMiddleware, deletePost);

export default router;