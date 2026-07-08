import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, 'O post não pode estar vazio').max(280, 'Post muito longo (máximo 280 caracteres)'),
});