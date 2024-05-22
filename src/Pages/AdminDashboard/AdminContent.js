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

const { Header, Content, Footer, Sider } = Layout;
const AdminContent = () => {

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                AdminContent
            </div>
        </Content>
    )
}

export default AdminContent;