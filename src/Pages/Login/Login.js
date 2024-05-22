import React, { useContext, useState } from "react";

import { Button, Checkbox, Form, Input, Card, Col, Row, Flex } from 'antd';
import { signInWithGooglePopup } from "../../firebase";
import { PoweroffOutlined } from '@ant-design/icons';
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { loggedInAdmin, setLoggedInAdmin } = useContext(DataContext);
    const [loading, setLoading] = useState(false);

    const handleSigninGoogle = async () => {
        setLoading(true)
        const response = await signInWithGooglePopup();
        setLoggedInAdmin(response)
        setLoading(false)
        navigate("/adminDashboard")
    }

    return (
        <div className="centerScreen">
            <Flex gap="small" vertical>
                <Flex gap="small" wrap>
                    <Button
                        type="primary"
                        icon={<PoweroffOutlined />}
                        loading={loading}
                        onClick={handleSigninGoogle}
                    >
                        Sign in
                    </Button>
                </Flex>
            </Flex>
        </div>
    )
}

export default Login;