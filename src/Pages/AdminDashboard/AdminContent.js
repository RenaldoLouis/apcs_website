import React, { useState } from 'react';
import { Layout, theme, Button } from 'antd';
import apis from '../../apis';

const { Content } = Layout;
const AdminContent = () => {
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const [isLoading, setIsLoading] = useState(false)

    const handleClickSendEmail = () => {
        try {
            setIsLoading(true)
            apis.email.sendEmail().then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                } else {
                    setIsLoading(false)
                }
            })
        } catch (e) {

        }
    }

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
            <Button isLoading={isLoading} onClick={handleClickSendEmail} type="primary">Primary Button</Button>
        </Content>
    )
}

export default AdminContent;