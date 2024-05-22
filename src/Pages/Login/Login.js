import React, { useContext, useState } from "react";

import { Button, Checkbox, Form, Input, Card, Col, Row, Flex } from 'antd';
import { signInWithGooglePopup } from "../../firebase";
import { PoweroffOutlined } from '@ant-design/icons';
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const { loggedInAdmin, setLoggedInAdmin } = useContext(DataContext);
    const [loading, setLoading] = useState(false);

    const handleSigninGoogle = async () => {
        try {
            setLoading(true);
            const response = await signInWithGooglePopup();
            setLoggedInAdmin(response);
            navigate("/adminDashboard");
        } catch (error) {
            console.error("Google sign-in failed", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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