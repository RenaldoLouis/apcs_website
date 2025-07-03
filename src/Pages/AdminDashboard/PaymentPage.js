import { Button, Card, Col, Divider, List, message, Row, Spin, Tabs, Typography } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../apis';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // State received from the booking page
    const [order, setOrder] = useState(null);
    const [qrisString, setQrisString] = useState('');
    const [bookingId, setBookingId] = useState('');

    useEffect(() => {
        if (state) {
            setOrder(state.orderSummary);
            setQrisString(state.qrisString);
            setBookingId(state.bookingId);
        } else {
            // If no state is passed, redirect back to home/booking page
            message.error("No booking data found. Please start again.");
            navigate('/');
        }
    }, [state, navigate]);

    // This hook will poll the backend to check for payment status
    useEffect(() => {
        if (!bookingId) return;

        const pollingInterval = setInterval(async () => {
            try {
                const response = await apis.bookings.checkStatus(bookingId);
                if (response.data.status === 'paid') {
                    clearInterval(pollingInterval);
                    message.success("Payment successful! Your e-ticket has been sent to your email.");
                    // Navigate to a final success page
                    navigate(`/booking-success/${bookingId}`);
                }
            } catch (error) {
                console.error("Payment status poll failed:", error);
            }
        }, 5000); // Poll every 5 seconds

        // Cleanup function to stop polling when the component unmounts
        return () => clearInterval(pollingInterval);
    }, [bookingId, navigate]);

    if (!order) {
        return <Spin size="large" />;
    }

    return (
        <Row justify="center" style={{ padding: '40px' }}>
            <Col xs={24} md={12} lg={10}>
                <Card>
                    <Title level={3}>Complete Your Payment</Title>
                    <List
                        dataSource={order.items}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.description}
                                    description={item.quantity > 1 ? `Quantity: ${item.quantity}` : ''}
                                />
                                <Text>${item.price}</Text>
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <Row justify="space-between">
                        <Col><Title level={4}>Total to Pay</Title></Col>
                        <Col><Title level={4}>${order.total}</Title></Col>
                    </Row>
                    <Divider />

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Pay with QRIS" key="1">
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Paragraph>Scan the code below using your mobile banking or e-wallet application.</Paragraph>
                                {qrisString ? <QRCodeSVG value={qrisString} size={256} /> : <Spin />}
                                <Paragraph strong style={{ marginTop: '20px' }}>Waiting for payment...</Paragraph>
                                <Text type="secondary">This page will automatically update upon successful payment.</Text>
                            </div>
                        </TabPane>
                        <TabPane tab="Bank Transfer (Manual)" key="2">
                            <div style={{ padding: '20px' }}>
                                <Paragraph>Please transfer the exact amount of <Text strong>${order.total}</Text> to the following account:</Paragraph>
                                <Paragraph>
                                    <strong>Bank Name:</strong> Bank Central Asia (BCA)<br />
                                    <strong>Account Number:</strong> 123-456-7890<br />
                                    <strong>Account Name:</strong> Your Orchestra Foundation
                                </Paragraph>
                                <Divider />
                                <Paragraph strong>IMPORTANT:</Paragraph>
                                <Paragraph>After transferring, please send your proof of payment to our admin via WhatsApp for manual confirmation.</Paragraph>
                                <Button type="primary" href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank">
                                    Chat Admin Now
                                </Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Col>
        </Row>
    );
};

export default PaymentPage;