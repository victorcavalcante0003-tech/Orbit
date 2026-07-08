import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { createPostSchema } from '../schemas/post.schema';

export async function createPost(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const parsed = createPostSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
  }

  const post = await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: req.userId,
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return res.status(201).json(post);
}

export async function getPostById(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  return res.json(post);
}

export async function deletePost(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: 'Você não tem permissão para deletar este post' });
  }

  await prisma.post.delete({ where: { id } });

  return res.status(204).send();
}

export async function getFeed(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const following = await prisma.follow.findMany({
    where: { followerId: req.userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  const posts = await prisma.post.findMany({
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return res.json({ posts, page, limit });
}