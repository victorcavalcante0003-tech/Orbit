import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMe, updateMe, getUserById, getUserPosts } from '../controllers/users.controller';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/follow.controller';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

router.post('/:id/follow', authMiddleware, followUser);
router.delete('/:id/follow', authMiddleware, unfollowUser);
router.get('/:id/followers', listFollowers);
router.get('/:id/following', listFollowing);

router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

export default router;