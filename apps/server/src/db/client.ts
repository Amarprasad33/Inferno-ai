import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });