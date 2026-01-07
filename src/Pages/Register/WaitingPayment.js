// src/pages/WaitingPaymentPage.js
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apis from '../../apis'; // Import your API handler

const WaitingPaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);

    // Use a ref to stop polling if component unmounts
    const stopPolling = useRef(false);

    useEffect(() => {
        if (!id) return;

        const checkStatus = async () => {
            if (stopPolling.current) return;

            try {
                // Call your new secure backend endpoint
                // e.g. GET /api/registrant-status/:id
                const response = await apis.payment.getRegistrantStatus(id);
                // Or: axios.get(`${process.env.REACT_APP_API_URL}/registrant-status/${id}`)

                const currentStatus = response.data.paymentStatus;

                if (currentStatus === 'PAID') {
                    setStatus('PAID');
                    setLoading(false);
                    stopPolling.current = true; // Stop the loop
                }
            } catch (error) {
                console.error("Polling error", error);
                // Don't stop polling on network error, might be temporary
            }
        };

        // 1. Check immediately
        checkStatus();

        // 2. Set up Polling Interval (every 3 seconds)
        const intervalId = setInterval(checkStatus, 3000);

        // Cleanup function
        return () => {
            stopPolling.current = true;
            clearInterval(intervalId);
        };
    }, [id]);

    const handleFinish = () => {
        navigate('/');
    };

    if (status === 'PAID') {
        return (
            <div className="container" style={{ height: '100vh', paddingTop: '100px', textAlign: 'center', color: '#e5cc92' }}>

                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#e5cc92' }} />}
                    title={<span style={{ color: '#e5cc92' }}>Payment Successful!</span>}
                    subTitle={<span style={{ color: 'white' }}>Thank you for your payment. Your registration is now complete.</span>}
                    extra={[
                        <Button type="primary" key="console" onClick={handleFinish}
                            style={{ backgroundColor: '#e5cc92', color: 'black', borderColor: '#e5cc92' }}>
                            Back to Home
                        </Button>,
                    ]}
                    style={{ backgroundColor: '#1E1E1E', borderRadius: '8px', padding: '40px' }}
                />
            </div>
        );
    }

    return (
        <div className="container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#121212',
            color: '#e5cc92'
        }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#e5cc92' }} spin />} />
            <h2 style={{ marginTop: 30, color: '#e5cc92' }}>Waiting for Payment...</h2>
            <p style={{ color: '#aaa', textAlign: 'center' }}>
                We have opened a new tab for you to complete your payment or you can check your email or Whatsapp for the invoice if it's no opened.<br />
                <strong>Please do not close this page.</strong><br />
                It will update automatically once we receive the confirmation.
            </p>
            <p style={{ fontSize: 12, marginTop: 50, color: '#666' }}>
                Transaction ID: {id}
            </p>
        </div>
    );
};

export default WaitingPaymentPage;