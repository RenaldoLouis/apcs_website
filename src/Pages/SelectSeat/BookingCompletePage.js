import { Button, Result, Typography } from 'antd'; // 1. Import Typography
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography; // 2. Destructure the components you need

const BookingCompletePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000', // Assuming a black background
        }}>
            <Result
                status="success"
                title={
                    <Title level={2} style={{ color: '#EBBC64' }}>
                        Thank You! Your Seats are Confirmed.
                    </Title>
                }
                subTitle={
                    <Paragraph style={{ color: '#EBBC64' }}>
                        Your E-Ticket and full booking details have been sent to your email. Please present the e-ticket at the venue entrance.
                    </Paragraph>
                }
                extra={[
                    <Button type="primary" key="home" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>,
                ]}
            />
        </div>
    );
};

export default BookingCompletePage;