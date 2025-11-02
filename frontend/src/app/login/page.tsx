"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Card, Alert, Layout } from "antd";
import "antd/dist/reset.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            setRedirecting(true);
            router.replace("/issues");
        }
    }, [router]);

    const [redirecting, setRedirecting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        function getErrorMessage(e: unknown): string {
            if (typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
                return (e as { message: string }).message;
            }
            return "An unexpected error occurred";
        }
        e.preventDefault();
        setError("");
        if (!email || !name) {
            setError("Email and name are required");
            return;
        }
        try {
            const { token, user } = await (await import("../../services/authService")).login(email, name);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/issues");
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        }
    };

    const { Title } = Typography;
    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                {redirecting ? (
                    <Card variant="borderless" style={{ width: 420, minWidth: 420, borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 0, textAlign: 'center' }}>
                        <Typography.Title level={3} style={{ marginBottom: 24 }}>Redirecting to Issues...</Typography.Title>
                        <div style={{ marginBottom: 24 }}>
                            <Button type="primary" loading size="large" style={{ width: 160, fontWeight: 600 }}>
                                Please wait
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card variant="borderless" style={{ width: 420, minWidth: 420, borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 0 }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontWeight: 700, letterSpacing: 0.5 }}>Login</Title>
                        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 32 }} />}
                        <Form layout="vertical" onSubmitCapture={handleSubmit}>
                            <Form.Item label="Email" required>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item label="Name" required>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block size="large" style={{ fontWeight: 600, minWidth: 160, padding: '10px 0', fontSize: 18, borderRadius: 8 }}>
                                    Login
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button block size="large" style={{ minWidth: 160, borderRadius: 8 }} onClick={() => router.push("/register")}>Sign Up</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}
            </Layout.Content>
        </Layout>
    );
}
