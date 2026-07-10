import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createPost, getPostById, deletePost, getFeed } from '../controllers/posts.controller';
import { likePost, unlikePost } from '../controllers/likes.controller';
import { createComment, listComments } from '../controllers/comments.controller';

const router = Router();

/**
 * @openapi
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Cria um novo post
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, maxLength: 280, example: "Meu primeiro post!" }
 *     responses:
 *       201:
 *         description: Post criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       400: { description: Conteúdo inválido }
 */
router.post('/', authMiddleware, createPost);

/**
 * @openapi
 * /posts/feed:
 *   get:
 *     tags: [Posts]
 *     summary: Retorna o feed (posts de quem o usuário segue)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, default: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, default: 10 } }
 *     responses:
 *       200:
 *         description: Lista paginada do feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts: { type: array, items: { $ref: '#/components/schemas/Post' } }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 */
router.get('/feed', authMiddleware, getFeed);

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Retorna um post específico
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       404: { description: Post não encontrado }
 *   delete:
 *     tags: [Posts]
 *     summary: Deleta um post próprio
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Post deletado }
 *       403: { description: Sem permissão para deletar este post }
 *       404: { description: Post não encontrado }
 */
router.get('/:id', getPostById);
router.delete('/:id', authMiddleware, deletePost);

/**
 * @openapi
 * /posts/{id}/like:
 *   post:
 *     tags: [Likes]
 *     summary: Curte um post
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       201: { description: Post curtido }
 *       409: { description: Você já curtiu este post }
 *   delete:
 *     tags: [Likes]
 *     summary: Remove a curtida de um post
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Curtida removida }
 *       404: { description: Curtida não encontrada }
 */
router.post('/:id/like', authMiddleware, likePost);
router.delete('/:id/like', authMiddleware, unlikePost);

/**
 * @openapi
 * /posts/{id}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Comenta em um post
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, maxLength: 280 }
 *     responses:
 *       201:
 *         description: Comentário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comment' }
 *   get:
 *     tags: [Comments]
 *     summary: Lista os comentários de um post
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *       - { name: page, in: query, schema: { type: integer, default: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, default: 10 } }
 *     responses:
 *       200:
 *         description: Lista paginada de comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments: { type: array, items: { $ref: '#/components/schemas/Comment' } }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 */
router.post('/:id/comments', authMiddleware, createComment);
router.get('/:id/comments', listComments);

export default router;