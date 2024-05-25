import React, { useContext, useState } from "react";

import { Button, Checkbox, Form, Input, Card, Col, Row, Flex } from 'antd';
import { signInWithGooglePopup } from "../../firebase";
import { PoweroffOutlined } from '@ant-design/icons';
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { CookieKeys } from "../../constant/CookieKeys";

const Login = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);
    const [loading, setLoading] = useState(false);

    const handleSigninGoogle = async () => {
        try {
            setLoading(true);
            const response = await signInWithGooglePopup();
            setCookie(CookieKeys.LOGGEDINUSER, response.user.accessToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day expiry
            })
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