import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { message, Card, Typography, Spin, Result } from 'antd';
import apis from '../../apis';

// The updated page will do the following:

// On page load, it will first check if a ticket token is present in the URL.

// If a token is found, it will immediately verify it and show the result(Success or Error).

// If no token is found, it will show the in -app camera scanner so the admin can scan a code manually.

const { Title, Text } = Typography;

const ScannerPage = () => {
    // We use 'idle', 'scanning', 'loading', 'success', or 'error' to manage the state
    const [status, setStatus] = useState('idle');
    const [resultMessage, setResultMessage] = useState('');

    // This hook lets us read the URL's query parameters
    const location = useLocation();

    // A reusable function to verify a token
    const verifyToken = async (token) => {
        if (!token) return;

        setStatus('loading');
        setResultMessage('Verifying ticket...');
        try {
            const response = await apis.tickets.verify({ token });
            setStatus('success');
            setResultMessage(`Welcome, ${response.data.name}!`);
            message.success(response.data.message);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid Ticket';
            setStatus('error');
            setResultMessage(errorMessage);
            message.error(errorMessage);
        }
    };

    // This effect runs ONCE when the page loads
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ticketToken = queryParams.get('ticket');

        if (ticketToken) {
            // If the page was opened with a token in the URL, verify it immediately
            verifyToken(ticketToken);
        } else {
            // If no token, get ready to scan
            setStatus('scanning');
        }
    }, [location.search]);

    const handleScan = (result) => {
        if (!!result && status === 'scanning') {
            const url = result.getText();
            if (url.includes('/check-in?ticket=')) {
                const token = new URL(url).searchParams.get('ticket');
                verifyToken(token);
            }
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <Spin tip={resultMessage} size="large" />;
            case 'success':
                return <Result status="success" title="Check-in Successful" subTitle={resultMessage} />;
            case 'error':
                return <Result status="error" title="Check-in Failed" subTitle={resultMessage} />;
            case 'scanning':
                return (
                    <>
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
                            Point the camera at an E-Ticket QR Code.
                        </Text>
                        <QrReader
                            onResult={handleScan}
                            constraints={{ facingMode: 'environment' }}
                            style={{ width: '100%' }}
                        />
                    </>
                );
            default:
                return <Spin size="large" />;
        }
    };

    return (
        <Card title="Event Check-in" style={{ maxWidth: 500, margin: '40px auto' }}>
            <div style={{ minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderContent()}
            </div>
        </Card>
    );
};

export default ScannerPage;