import { PrismaClient } from '../../generated/prisma';

declare global {
	// eslint-disable-next-line no-var
	var __PRISMA__: PrismaClient | undefined;
}

export const prisma =
	global.__PRISMA__ ??
	new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
	global.__PRISMA__ = prisma;
}