"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchIssueById, updateIssue, clearIssuesCache, clearSummaryCache } from "@/services/issueService";
import { Form, Button, Select, Typography, Card, Alert, Space, Layout, Spin } from "antd";
import { AppHeader, AppFooter } from "@/components/AppLayout";
import "antd/dist/reset.css";
import { IssueUpdatePayload } from "@/utils/types/issue";

const TEAM = ["Ali", "Fatima", "Ahmed", "Unassigned"];
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"];

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    createdAt: string;
    updatedAt: string;
}

export default function IssueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [status, setStatus] = useState("");
    const [assignee, setAssignee] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchIssue();
        // eslint-disable-next-line
    }, [id]);

    const fetchIssue = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token") || "";
            const data = await fetchIssueById(token, String(id));
            setIssue(data);
            setStatus(data.status);
            setAssignee(data.assignee);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setError("");
        try {
            const token = localStorage.getItem("token") || "";
            const update: IssueUpdatePayload = { status, assignee };
            await updateIssue(token, String(id), update);
            clearIssuesCache(token);
            clearSummaryCache(token);
            router.push("/issues");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    if (loading) return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
    if (error) return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Alert message={error} type="error" showIcon />
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
    if (!issue) return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Alert message="Issue not found." type="warning" showIcon />
            </Layout.Content>
            <AppFooter />
        </Layout>
    );

    const { Title, Text } = Typography;
    const { Option } = Select;
    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ width: 1000, margin: '48px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 56 }}>
                <Card variant="borderless" style={{ boxShadow: 'none', padding: 0 }}>
                    <Button type="default" size="large" style={{ marginBottom: 24, minWidth: 120, borderRadius: 8, fontWeight: 500 }} onClick={() => router.push('/issues')}>
                        ← Back
                    </Button>
                    <Title level={2} style={{ marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>Edit Issue</Title>
                    <Text type="secondary" style={{ fontSize: 18, marginBottom: 32, display: 'block' }}>{issue.title}</Text>
                    <Text style={{ display: 'block', marginBottom: 32, fontSize: 16 }}>{issue.description}</Text>
                    <Form layout="vertical" onSubmitCapture={e => { e.preventDefault(); handleUpdate(); }}>
                        <Space size={32} style={{ display: 'flex', marginBottom: 32 }}>
                            <Form.Item label="Status" required style={{ flex: 1, marginBottom: 0, minWidth: 150 }}>
                                <Select value={status} onChange={setStatus} size="large">
                                    {STATUSES.map((s) => (
                                        <Option key={s} value={s}>{s.replace("_", " ")}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Assignee" required style={{ flex: 1, marginBottom: 0, minWidth: 150 }}>
                                <Select value={assignee} onChange={setAssignee} size="large">
                                    {TEAM.map((member) => (
                                        <Option key={member} value={member}>{member}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label=" " colon={false} style={{ flex: 1, marginBottom: 0, display: 'flex', alignItems: 'end' }}>
                                <Button type="primary" htmlType="submit" block size="large" style={{ fontWeight: 600, minWidth: 150, padding: '12px 0', fontSize: 18, borderRadius: 8, letterSpacing: 0.5 }}>
                                    Update Issue
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                    <div style={{ marginTop: 48, padding: 24, background: '#f7f9fa', borderRadius: 8 }}>
                        <Text type="secondary" style={{ fontSize: 16, marginRight: 32 }}>Priority: <b>{issue.priority}</b></Text>
                        <Text type="secondary" style={{ fontSize: 16, marginRight: 32 }}>Created: <b>{new Date(issue.createdAt).toLocaleString()}</b></Text>
                        <Text type="secondary" style={{ fontSize: 16 }}>Last Updated: <b>{new Date(issue.updatedAt).toLocaleString()}</b></Text>
                    </div>
                </Card>
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
}
