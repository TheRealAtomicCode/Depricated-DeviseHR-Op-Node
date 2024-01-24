import {
	PrismaClient,
	operators,
	users,
	notes,
	companies,
} from '@prisma/client';

const prisma = new PrismaClient();
export { prisma, operators, users, notes, companies };
