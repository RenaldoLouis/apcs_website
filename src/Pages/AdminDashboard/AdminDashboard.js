import {
    BookOutlined,
    ContactsOutlined,
    DesktopOutlined,
    FileOutlined,
    ReadOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../context/DataContext';
// import { getAuth, signOut } from "firebase/auth";
import AdminContent from './AdminContent';
import ContactFormSubmitted from './ContactFormSubmitted.js';
import GeneralSeat from './GeneralSeat';
import RegistrantDashboard from './RegistrantDashboard';
import SeatingEvent from './SeatEvent';
import SeatingContent from './SeatingContent';

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
        getItem('Contact Form Submitted', '1', <ContactsOutlined />),
        getItem('Admin Page', '2', <DesktopOutlined />),
        getItem('Registrant Data', '3', <DesktopOutlined />),
        getItem('Seating', '4', <UsergroupAddOutlined />),
        getItem('Seat Event', '5', <ReadOutlined />),
        getItem('General Seat', '6', <BookOutlined />),
        getItem('User', 'sub1', <UserOutlined />, () => { }, [
            getItem('Tom', '7'),
            getItem('Bill', '8'),
            getItem('Alex', '9'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined />, () => { }, [getItem('Team 1', '10'), getItem('Team 2', '11')]),
        getItem('Sign out', '12', <FileOutlined />, handleSignOut),
    ];


    const ShowWhichContent = () => {
        switch (selectedKey) {
            case '1':
                return <ContactFormSubmitted />;
            case '2':
                return <AdminContent />;
            case '3':
                return <RegistrantDashboard />;
            case '4':
                return <SeatingContent />;
            case '5':
                return <SeatingEvent />;
            case '6':
                return <GeneralSeat />;
            default:
                return <ContactFormSubmitted />;
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