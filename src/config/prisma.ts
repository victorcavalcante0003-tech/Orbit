import 'dotenv/config';
import { PrismaClient } from 'C:/Users/victo/orbit-api/node_modules/@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });