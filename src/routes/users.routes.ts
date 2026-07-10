import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMe, updateMe, getUserById, getUserPosts } from '../controllers/users.controller';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/follow.controller';

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Retorna o perfil do usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dados do usuário logado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Não autenticado
 *   patch:
 *     tags: [Users]
 *     summary: Atualiza o perfil do usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               bio: { type: string }
 *               avatarUrl: { type: string }
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Dados inválidos
 */
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

/**
 * @openapi
 * /users/{id}/follow:
 *   post:
 *     tags: [Follow]
 *     summary: Segue um usuário
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       201: { description: Usuário seguido com sucesso }
 *       400: { description: Não é possível seguir a si mesmo }
 *       404: { description: Usuário não encontrado }
 *       409: { description: Você já segue este usuário }
 *   delete:
 *     tags: [Follow]
 *     summary: Deixa de seguir um usuário
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Deixou de seguir com sucesso }
 *       404: { description: Você não segue este usuário }
 */
router.post('/:id/follow', authMiddleware, followUser);
router.delete('/:id/follow', authMiddleware, unfollowUser);

/**
 * @openapi
 * /users/{id}/followers:
 *   get:
 *     tags: [Follow]
 *     summary: Lista os seguidores de um usuário
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Lista de seguidores
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/User' } }
 * /users/{id}/following:
 *   get:
 *     tags: [Follow]
 *     summary: Lista quem um usuário segue
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Lista de usuários seguidos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/User' } }
 */
router.get('/:id/followers', listFollowers);
router.get('/:id/following', listFollowing);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Retorna o perfil público de um usuário
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Perfil público
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404: { description: Usuário não encontrado }
 * /users/{id}/posts:
 *   get:
 *     tags: [Users]
 *     summary: Lista os posts de um usuário
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *       - { name: page, in: query, schema: { type: integer, default: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, default: 10 } }
 *     responses:
 *       200:
 *         description: Lista paginada de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts: { type: array, items: { $ref: '#/components/schemas/Post' } }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 */
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

export default router;