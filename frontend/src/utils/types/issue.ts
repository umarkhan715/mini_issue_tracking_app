export interface IssuesSummary {
    byStatus: { status: string; _count: { status: number } }[];
    byAssignee: { assignee: string; _count: { assignee: number } }[];
}

export interface IssuePayload {
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee: string;
}

export interface IssueUpdatePayload {
    status?: string;
    assignee?: string;
}

export type Issue = {
    id: number;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    createdAt: string;
};
