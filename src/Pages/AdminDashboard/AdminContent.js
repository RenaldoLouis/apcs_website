import React from 'react';
import { Layout, theme } from 'antd';

const { Content } = Layout;
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