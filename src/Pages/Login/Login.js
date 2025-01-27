import React, { useEffect, useState } from "react";

import { Button, Flex } from 'antd';
// import { signInWithGooglePopup } from "../../firebase";
import { PoweroffOutlined } from '@ant-design/icons';
import { useAuth } from "../../context/DataContext";
import { toast } from "react-toastify";
import { auth, provider } from '../../firebase';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const { signInWithGoogle } = useAuth();

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                navigate("/adminDashboard");
            }
        });

        return () => unsubscribe();
    }, []);

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