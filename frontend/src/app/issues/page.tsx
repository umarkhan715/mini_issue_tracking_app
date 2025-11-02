"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchIssues as fetchIssuesService, deleteIssue as deleteIssueService, getIssuesSummary, clearIssuesCache, clearSummaryCache } from "@/services/issueService";
import { Table, Button, Select, Typography, Space, Layout, Divider, Modal } from "antd";
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { AppHeader, AppFooter } from "@/components/AppLayout";
import "antd/dist/reset.css";
import { Issue, IssuesSummary } from "@/utils/types/issue";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [summary, setSummary] = useState<IssuesSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchIssues(token);
    // eslint-disable-next-line
  }, [status, priority]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSummaryLoading(true);
    getIssuesSummary(token)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, []);

  const fetchIssues = async (token: string) => {
    function getErrorMessage(e: unknown): string {
      if (typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
        return (e as { message: string }).message;
      }
      return "An unknown error occurred";
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchIssuesService(token, status, priority);
      setIssues(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const { Title, Text } = Typography;
  const { Option } = Select;

  // Helper to get count for a status
  const getStatusCount = (statusValue: string) => {
    if (!summary) return 0;
    const found = summary.byStatus.find((s) => s.status === statusValue);
    return found ? found._count.status : 0;
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Issue) => (
        <Button type="link" style={{ padding: 0, fontWeight: 600 }} onClick={() => router.push(`/issues/${record.id}`)}>{text}</Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <Text>{new Date(date).toLocaleString()}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Issue) => (
        <Space>
          <Button
            type="primary"
            size="middle"
            style={{ borderRadius: 8, fontWeight: 600, padding: '0 20px' }}
            onClick={() => router.push(`/issues/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            loading={deletingId === record.id}
            onClick={() => handleDelete(record.id)}
            style={{ padding: 0 }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this issue permanently?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        setDeletingId(id);
        setError("");
        try {
          await deleteIssueService(token, String(id));
          setIssues((prev) => prev.filter((issue) => issue.id !== id));
        } catch (err: unknown) {
          setError(
            typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
              ? (err as { message: string }).message
              : "Failed to delete issue"
          );
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Layout.Content style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: 1000, margin: '48px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 56 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={40}>
          <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>Issues</Title>
            <Space size={16}>
              <Button
                size="large"
                icon={<ReloadOutlined spin={loading || summaryLoading} />}
                style={{ fontWeight: 600, minWidth: 56, padding: '0 16px', background: '#f6ffed', color: '#389e0d', border: '1px solid #b7eb8f' }}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (!token) return;
                  clearIssuesCache(token);
                  clearSummaryCache(token);
                  setLoading(true);
                  setSummaryLoading(true);
                  await Promise.all([
                    fetchIssues(token),
                    getIssuesSummary(token).then(setSummary).catch(() => setSummary(null)).finally(() => setSummaryLoading(false))
                  ]);
                  setLoading(false);
                }}
                title="Refresh"
              />
              <Button
                size="large"
                style={{ fontWeight: 600, minWidth: 140, padding: '0 24px', background: '#f0f5ff', color: '#1677ff', border: '1px solid #1677ff' }}
                onClick={() => router.push("/issues/stats")}
              >
                View Stats
              </Button>
              <Button type="primary" icon={<PlusOutlined />} size="large" style={{ fontWeight: 600, minWidth: 160, padding: '0 32px' }} onClick={() => router.push("/issues/create")}>Create Issue</Button>
            </Space>
          </Space>
          <Divider style={{ margin: '20px 0' }} />
          <Space style={{ marginBottom: 24 }} size={24}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: 220 }}
              placeholder="All Statuses"
              allowClear
              size="large"
              loading={summaryLoading}
            >
              <Option value="">
                All Statuses
                <span style={{ marginLeft: 8, color: '#888', fontWeight: 400 }}>
                  {summary ? summary.byStatus.reduce((acc, s) => acc + s._count.status, 0) : ''}
                </span>
              </Option>
              <Option value="OPEN">
                Open
                <span style={{ marginLeft: 8, color: '#888', fontWeight: 400 }}>
                  {getStatusCount("OPEN")}
                </span>
              </Option>
              <Option value="IN_PROGRESS">
                In Progress
                <span style={{ marginLeft: 8, color: '#888', fontWeight: 400 }}>
                  {getStatusCount("IN_PROGRESS")}
                </span>
              </Option>
              <Option value="RESOLVED">
                Resolved
                <span style={{ marginLeft: 8, color: '#888', fontWeight: 400 }}>
                  {getStatusCount("RESOLVED")}
                </span>
              </Option>
            </Select>
            <Select
              value={priority}
              onChange={setPriority}
              style={{ width: 180 }}
              placeholder="All Priorities"
              allowClear
              size="large"
            >
              <Option value="">All Priorities</Option>
              <Option value="LOW">Low</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="HIGH">High</Option>
            </Select>
          </Space>
          {loading ? (
            <Text style={{ fontSize: 18 }}>Loading...</Text>
          ) : error ? (
            <div style={{ marginBottom: 24 }}>
              <Text type="danger" strong style={{ fontSize: 16 }}>{error}</Text>
            </div>
          ) : issues.length === 0 ? (
            <Text type="secondary" style={{ fontSize: 16 }}>No issues found.</Text>
          ) : (
            <Table
              dataSource={issues}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              style={{ background: '#fff', borderRadius: 12 }}
              size="large"
            />
          )}
        </Space>
      </Layout.Content>
      <AppFooter />
    </Layout>
  );
}
