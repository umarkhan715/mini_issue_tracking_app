"use client";
import { useEffect, useState } from "react";
import { getIssuesSummary } from "@/services/issueService";
import { Card, Typography, Layout, Space, Spin, Alert, Button } from "antd";
import { AppHeader, AppFooter } from "@/components/AppLayout";

import { Bar, Column } from '@ant-design/charts';
import "antd/dist/reset.css";
import { useRouter } from "next/navigation";
import { IssuesSummary } from "@/utils/types/issue";
const { Title } = Typography;

export default function IssuesStatsPage() {
    const [summary, setSummary] = useState<IssuesSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        getIssuesSummary(token)
            .then(setSummary)
            .catch((e) => setError(e.message || "Failed to load stats"))
            .finally(() => setLoading(false));
    }, []);

    const statusData = (summary?.byStatus || []).map(s => ({ status: s.status, count: s._count.status }));
    const assigneeData = (summary?.byAssignee || []).map(a => ({ assignee: a.assignee || "Unassigned", count: a._count.assignee }));

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />
            <Layout.Content style={{ width: 1000, margin: '48px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 56 }}>
                <Button type="default" size="large" style={{ marginBottom: 24, minWidth: 120, borderRadius: 8, fontWeight: 500 }} onClick={() => router.push('/issues')}>
                    ← Back
                </Button>
                <Space direction="vertical" style={{ width: '100%' }} size={40}>
                    <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>Issue Statistics</Title>
                    {loading ? (
                        <Spin size="large" />
                    ) : error ? (
                        <Alert type="error" message={error} />
                    ) : summary ? (
                        <Space direction="vertical" size={32} style={{ width: '100%' }}>
                            <Card title="Count by Status" style={{ width: '100%' }}>
                                <Bar
                                    data={statusData}
                                    xField="status"
                                    yField="count"
                                    color="#1677ff"
                                    height={250}

                                    autoFit
                                    label={{ position: 'top' }}
                                    xAxis={{ title: { text: 'Status' } }}
                                    yAxis={{ title: { text: 'Count' }, min: 0 }}
                                />
                            </Card>
                            <Card title="Count by Assignee" style={{ width: '100%' }}>
                                <Column
                                    data={assigneeData}
                                    xField="assignee"
                                    yField="count"
                                    color="#faad14"
                                    height={250}
                                    autoFit
                                    label={{ position: 'top' }}
                                    xAxis={{ title: { text: 'Assignee' } }}
                                    yAxis={{ title: { text: 'Count' }, min: 0 }}
                                />
                            </Card>
                        </Space>
                    ) : null}
                </Space>
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
}
