import React, { useContext, useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { DataContext } from '../../context/DataContext';
import { getAuth, signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContent from './UserContent';
import AdminContent from './AdminContent';
import { useCookies } from 'react-cookie';
import { CookieKeys } from '../../constant/CookieKeys';

const { Header, Content, Footer, Sider } = Layout;
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
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const [selectedKey, setSelectedKey] = useState('1'); // Initialize with default selected key

    const handleSignOut = () => {
        console.log("sign out");
        signOut(auth).then(() => {
            removeCookie(CookieKeys.LOGGEDINUSER, { path: '/' });
            navigate("/login");
            toast.success("Succesfully Sign Out")
        }).catch((error) => {
            toast.error("Sign Out Failed");
        });
    };

    const onMenuClick = (e) => {
        setSelectedKey(e.key); // Update selected key
    };

    const items = [
        getItem('User Data', '1', <PieChartOutlined />),
        getItem('ADmin Data', '2', <DesktopOutlined />),
        getItem('User', 'sub1', <UserOutlined />, () => { }, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined />, () => { }, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Sign out', '9', <FileOutlined />, handleSignOut),
    ];


    const ShowWhichContent = () => {
        switch (selectedKey) {
            case '1':
                return <UserContent />;
            case '2':
                return <AdminContent />;
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