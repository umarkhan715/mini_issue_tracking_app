import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (data: any) => {
    return prisma.issue.create({ data });
};

export const get = async (filter: any = {}) => {
    return prisma.issue.findMany({ where: filter, orderBy: { createdAt: 'desc' } });
};

export const getById = async (id: number) => {
    return prisma.issue.findUnique({ where: { id } });
};

export const update = async (id: number, data: any) => {
    return prisma.issue.update({ where: { id }, data });
};

export const remove = async (id: number) => {
    return prisma.issue.delete({ where: { id } });
};

export const getSummary = async () => {
    const byStatus = await prisma.issue.groupBy({
        by: ['status'],
        _count: { status: true },
    });
    const byAssignee = await prisma.issue.groupBy({
        by: ['assignee'],
        _count: { assignee: true },
    });
    return { byStatus, byAssignee };
};
