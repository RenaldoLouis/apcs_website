import React, { useContext, useState } from "react";

import { Button, Checkbox, Form, Input, Card, Col, Row, Flex } from 'antd';
// import { signInWithGooglePopup } from "../../firebase";
import { PoweroffOutlined } from '@ant-design/icons';
import { DataContext, useAuth } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { CookieKeys } from "../../constant/CookieKeys";

const Login = () => {
    const navigate = useNavigate();
    const { signInWithGoogle, user } = useAuth();

    const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);
    const [loading, setLoading] = useState(false);

    const handleSigninGoogle = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
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