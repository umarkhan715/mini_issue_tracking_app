import { IssuesSummary, IssuePayload, IssueUpdatePayload, Issue as IssueType } from '@/utils/types/issue';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const issuesCache = new Map<string, IssueType[]>();
const summaryCache = new Map<string, IssuesSummary>();

export async function fetchIssues(token: string, status?: string, priority?: string) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    const cacheKey = `${token}|${status || ''}|${priority || ''}`;
    if (issuesCache.has(cacheKey)) {
        return issuesCache.get(cacheKey);
    }
    const res = await fetch(`${API_URL}/issues?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to fetch issues";
        throw new Error(message);
    }
    issuesCache.set(cacheKey, data);
    return data;
}

export async function createIssue(token: string, issue: IssuePayload) {
    const res = await fetch(`${API_URL}/issues`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(issue),
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to create issue";
        throw new Error(message);
    }
    return data;
}

export async function fetchIssueById(token: string, id: string) {
    const res = await fetch(`${API_URL}/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to fetch issue";
        throw new Error(message);
    }
    return data;
}

export async function updateIssue(token: string, id: string, update: IssueUpdatePayload) {
    const res = await fetch(`${API_URL}/issues/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(update),
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to update issue";
        throw new Error(message);
    }
    return data;
}

export async function deleteIssue(token: string, id: string) {
    const res = await fetch(`${API_URL}/issues/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to delete issue";
        throw new Error(message);
    }
    return data;
}

export async function getIssuesSummary(token: string): Promise<IssuesSummary> {
    if (summaryCache.has(token)) {
        // Type assertion is safe here because we only set IssuesSummary
        return summaryCache.get(token)!;
    }
    const res = await fetch(`${API_URL}/issues/summary`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.error?.message || data?.error || "Failed to fetch summary";
        throw new Error(message);
    }
    summaryCache.set(token, data);
    return data;
}

export function clearIssuesCache(token: string) {
    // Remove all cache entries for this token
    for (const key of issuesCache.keys()) {
        if (key.startsWith(token)) {
            issuesCache.delete(key);
        }
    }
}

export function clearSummaryCache(token: string) {
    summaryCache.delete(token);
}