import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { deleteComment } from '../controllers/comments.controller';

const router = Router();

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Deleta um comentário próprio
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Comentário deletado }
 *       403: { description: Sem permissão para deletar este comentário }
 *       404: { description: Comentário não encontrado }
 */
router.delete('/:id', authMiddleware, deleteComment);

export default router;