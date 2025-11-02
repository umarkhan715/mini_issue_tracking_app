"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIssue, clearIssuesCache, clearSummaryCache } from "@/services/issueService";
import { Form, Input, Button, Select, Typography, Card, Alert, Space, Layout } from "antd";
import { AppHeader, AppFooter } from "@/components/AppLayout";
import "antd/dist/reset.css";
import { IssuePayload } from "@/utils/types/issue";

const TEAM = ["Ali", "Fatima", "Ahmed", "Unassigned"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export default function CreateIssuePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [status, setStatus] = useState("OPEN");
    const [assignee, setAssignee] = useState("Unassigned");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        function getErrorMessage(e: unknown): string {
            if (typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
                return (e as { message: string }).message;
            }
            return "An unexpected error occurred";
        }
        e.preventDefault();
        setError("");
        if (!title || !description) {
            setError("Title and description are required");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const payload: IssuePayload = { title, description, priority, status, assignee };
            await createIssue(token, payload);
            clearIssuesCache(token);
            clearSummaryCache(token);
            router.push("/issues");
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const { Title } = Typography;
    const { Option } = Select;
    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ width: 1000, margin: '48px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 56 }}>
                <Card variant="borderless" style={{ boxShadow: 'none', padding: 0 }}>
                    <Button type="default" size="large" style={{ marginBottom: 24, minWidth: 120, borderRadius: 8, fontWeight: 500 }} onClick={() => router.push('/issues')}>
                        ← Back
                    </Button>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontWeight: 700, letterSpacing: 0.5 }}>Create Issue</Title>
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 32 }} />}
                    <Form layout="vertical" onSubmitCapture={handleSubmit}>
                        <Form.Item label="Title" required>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter issue title" size="large" />
                        </Form.Item>
                        <Form.Item label="Description" required>
                            <Input.TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter issue description" rows={4} size="large" />
                        </Form.Item>
                        <Space size={32} style={{ display: 'flex', marginBottom: 32 }}>
                            <Form.Item label="Priority" required style={{ flex: 1, marginBottom: 0, minWidth: 150 }}>
                                <Select value={priority} onChange={setPriority} size="large">
                                    {PRIORITIES.map((p) => (
                                        <Option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
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
                        </Space>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ fontWeight: 600, minWidth: 160, padding: '8px 0', fontSize: 18 }}>
                                {loading ? "Creating..." : "Create Issue"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
}
