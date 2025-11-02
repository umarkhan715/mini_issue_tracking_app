import * as issueRepo from '../repositories/issueRepository';

export const createIssue = async (data: any) => {
    return issueRepo.create(data);
};

export const getIssuesWithFilters = async (queryParams: any) => {
    const { status, priority } = queryParams;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    return issueRepo.get(filter);
};

export const getIssueById = async (id: number) => {
    const issue = await issueRepo.getById(id);
    if (!issue) {
        throw new Error('Issue not found');
    }
    return issue;
};

export const updateIssue = async (id: number, data: any) => {
    return issueRepo.update(id, data);
};

export const getIssuesSummary = async () => {
    return issueRepo.getSummary();
};

export const deleteIssue = async (id: number) => {
    return issueRepo.remove(id);
};
