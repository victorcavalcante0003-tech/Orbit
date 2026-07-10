import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import postsRoutes from './routes/posts.routes';
import commentsRoutes from './routes/comments.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});