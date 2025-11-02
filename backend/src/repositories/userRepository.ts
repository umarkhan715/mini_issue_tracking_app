import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const create = async (email: string, name: string) => {
    return prisma.user.create({ data: { email, name } });
};
