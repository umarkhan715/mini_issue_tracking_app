"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../services/authService";
import { Form, Input, Button, Typography, Card, Alert, Layout } from "antd";
import "antd/dist/reset.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !name) {
      setError("Email and name are required");
      return;
    }
    setLoading(true);
    try {
      await register(email, name);
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const { Title } = Typography;
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Card variant="borderless" style={{ width: 420, minWidth: 420, borderRadius: 16, boxShadow: '0 4px 24px #e6e6e6', padding: 0 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontWeight: 700, letterSpacing: 0.5 }}>Register</Title>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 32 }} />}
          {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 32 }} />}
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
              <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ fontWeight: 600, minWidth: 160, padding: '10px 0', fontSize: 18, borderRadius: 8 }}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button block size="large" style={{ minWidth: 160, borderRadius: 8 }} onClick={() => router.push("/login")}>Back to Login</Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
