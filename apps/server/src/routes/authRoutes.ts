import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
// import argon2 from 'argon2';
import { PrismaClient } from "../../generated/prisma";


export const auth = new Hono();
