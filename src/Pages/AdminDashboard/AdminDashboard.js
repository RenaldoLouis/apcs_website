import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    SendOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../context/DataContext';
// import { getAuth, signOut } from "firebase/auth";
import AdminContent from './AdminContent';
import MarketingContent from './MarketingContent';
import RegistrantDashboard from './RegistrantDashboard';
import SeatingContent from './SeatingContent';
import UserContent from './UserContent';

const { Header, Footer, Sider } = Layout;
function getItem(label, key, icon, onClick, children) {
    return {
        label,
        key,
        icon,
        onClick,
        children
    };
}

const AdminDashboard = () => {
    const { signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer }, } = theme.useToken();

    const [selectedKey, setSelectedKey] = useState('1'); // Initialize with default selected key

    const handleSignOut = () => {
        signOut();
    };

    const onMenuClick = (e) => {
        setSelectedKey(e.key); // Update selected key
    };

    const items = [
        getItem('User Data', '1', <PieChartOutlined />),
        getItem('User Winner Data', '2', <SendOutlined />),
        getItem('Admin Page', '3', <DesktopOutlined />),
        getItem('Registrant Data', '4', <DesktopOutlined />),
        getItem('Seating', '5', <UsergroupAddOutlined />),
        getItem('User', 'sub1', <UserOutlined />, () => { }, [
            getItem('Tom', '6'),
            getItem('Bill', '7'),
            getItem('Alex', '8'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined />, () => { }, [getItem('Team 1', '9'), getItem('Team 2', '10')]),
        getItem('Sign out', '11', <FileOutlined />, handleSignOut),
    ];


    const ShowWhichContent = () => {
        switch (selectedKey) {
            case '1':
                return <UserContent />;
            case '2':
                return <MarketingContent />;
            case '3':
                return <AdminContent />;
            case '4':
                return <RegistrantDashboard />;
            case '5':
                return <SeatingContent />;
            default:
                return <UserContent />;
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu onClick={onMenuClick} theme="dark" mode="inline" items={items} selectedKeys={[selectedKey]} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                {ShowWhichContent()}
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AdminDashboard;