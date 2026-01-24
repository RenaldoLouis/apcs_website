// src/pages/WaitingPaymentPage.js
import { CheckCircleOutlined, LoadingOutlined, WalletOutlined } from '@ant-design/icons'; // Added WalletOutlined
import { Button, Result, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Added useLocation
import apis from '../../apis';

const WaitingPaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const passedPaymentLink = location.state?.paymentLink;

    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const stopPolling = useRef(false);

    useEffect(() => {
        if (!id) return;

        const checkStatus = async () => {
            if (stopPolling.current) return;

            try {
                const response = await apis.payment.getRegistrantStatus(id);
                const currentStatus = response.data.paymentStatus;

                if (currentStatus === 'PAID') {
                    setStatus('PAID');
                    setLoading(false);
                    stopPolling.current = true;
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        };

        checkStatus();
        const intervalId = setInterval(checkStatus, 3000);

        return () => {
            stopPolling.current = true;
            clearInterval(intervalId);
        };
    }, [id]);

    const handleFinish = () => {
        navigate('/');
    };

    // Helper to open link manually
    const handleManualPay = () => {
        if (passedPaymentLink) {
            window.open(passedPaymentLink, '_blank');
        }
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
            color: '#e5cc92',
            padding: '20px'
        }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#e5cc92' }} spin />} />

            <h2 style={{ marginTop: 30, color: '#e5cc92' }}>Waiting for Payment...</h2>

            <p style={{ color: '#aaa', textAlign: 'center', maxWidth: 500 }}>
                We have attempted to open a new tab for you to complete your payment.<br />
                You can also check your Email or WhatsApp for the invoice.
            </p>

            {/* --- NEW: Backup Payment Button --- */}
            {passedPaymentLink && (
                <div style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
                    <p style={{ color: '#fff', marginBottom: 10 }}>Pop-up blocked?</p>
                    <Button
                        type="primary"
                        icon={<WalletOutlined />}
                        onClick={handleManualPay}
                        size="large"
                        style={{
                            backgroundColor: '#e5cc92',
                            color: '#000',
                            borderColor: '#e5cc92',
                            fontWeight: 'bold'
                        }}
                    >
                        Pay Now / Open Invoice
                    </Button>
                </div>
            )}

            <p style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
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