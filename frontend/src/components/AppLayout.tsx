import { Layout, Space, Typography, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export function AppHeader() {
  const { logout, user } = useAuth();
  return (
    <Layout.Header style={{ background: '#fff', padding: '0 40px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space align="center">
        <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ marginRight: 12 }} />
        <Typography.Title level={3} style={{ margin: 0, color: '#1677ff' }}>Mini Issue Tracker</Typography.Title>
      </Space>
      <Space align="center">
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
        <Typography.Text strong>{user?.name}</Typography.Text>
        <Button icon={<LogoutOutlined />} onClick={logout} type="text" danger>Logout</Button>
      </Space>
    </Layout.Header>
  );
}

export function AppFooter() {
  return (
    <Layout.Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0', marginTop: 32 }}>
      <Typography.Text type="secondary">© {new Date().getFullYear()} Mini Issue Tracker. All rights reserved.</Typography.Text>
    </Layout.Footer>
  );
}
