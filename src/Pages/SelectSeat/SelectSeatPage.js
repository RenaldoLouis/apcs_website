import { Button, Card, Result, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatPicker from 'react-seat-picker';
import apis from '../../apis';
const { Title, Text } = Typography;

const SelectSeatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying'); // 'verifying', 'valid', 'invalid'
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [seatLayout, setSeatLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // This useEffect runs once on page load to verify the token from the URL
    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            setStatus('invalid');
            setErrorMessage('No selection token found in the URL.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await apis.bookings.verifySeatToken({ token });
                setBookingData(response.data.bookingData);
                setSeatLayout(response.data.seatLayout);
                setStatus('valid');
            } catch (err) {
                setStatus('invalid');
                setErrorMessage(err.response?.data?.message || 'An unknown error occurred.');
            }
        };

        verifyToken();
    }, [location]);

    const handleConfirmSelection = async () => {
        if (selectedSeats.length !== maxReservableSeats) {
            message.warn(`Please select exactly ${maxReservableSeats} seat(s).`);
            return;
        }

        setIsLoading(true);
        try {
            const selectedSeatIds = selectedSeats.map(seat => seat.id);
            await apis.bookings.confirmSeats({
                bookingId: bookingData.id,
                selectedSeatIds
            });
            message.success('Seats confirmed successfully!');
            // Redirect to a final success page
            navigate('/booking-complete');
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to confirm seats.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Memos for calculating values ---
    const maxReservableSeats = useMemo(() => {
        if (!bookingData) return 0;
        // Calculate total seats from the 'tickets' array in your booking data
        return bookingData.tickets.reduce((total, ticket) => total + (ticket.seatQuantity || 0), 0);
    }, [bookingData]);

    const formattedSeatLayout = useMemo(() => {
        // Logic to format your flat seat list into rows for SeatPicker
        if (!seatLayout) return [];
        const rows = seatLayout.reduce((acc, seat) => {
            const { row, number, status, id } = seat;
            if (!acc[row]) acc[row] = [];
            acc[row].push({ id, number, isReserved: status !== 'available' });
            return acc;
        }, {});
        return Object.values(rows);
    }, [seatLayout]);


    // --- Conditional Rendering ---
    if (status === 'verifying') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin tip="Verifying your link..." size="large" /></div>;
    }

    if (status === 'invalid') {
        return <Result status="error" title="Invalid Access" subTitle={errorMessage || "This seat selection link is invalid, expired, or has already been used."} extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>} />;
    }

    return (
        <Card title="Select Your Seats" style={{ maxWidth: 800, margin: '40px auto' }}>
            <Title level={4}>Please select {maxReservableSeats} seat(s)</Title>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <SeatPicker
                    rows={formattedSeatLayout}
                    maxReservableSeats={maxReservableSeats}
                    alpha
                    visible
                    selectedByDefault
                    addSeatCallback={({ row, number, id }, addCb) => {
                        setSelectedSeats(prev => [...prev, { row, number, id }]);
                        addCb(row, number, id);
                    }}
                    removeSeatCallback={({ row, number, id }, removeCb) => {
                        setSelectedSeats(prev => prev.filter(seat => seat.id !== id));
                        removeCb(row, number);
                    }}
                />
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Text strong>Selected Seats: {selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}</Text>
                <br />
                <Button
                    type="primary"
                    size="large"
                    style={{ marginTop: '20px' }}
                    onClick={handleConfirmSelection}
                    loading={isLoading}
                    disabled={selectedSeats.length !== maxReservableSeats}
                >
                    Confirm Selection
                </Button>
            </div>
        </Card>
    );
};

export default SelectSeatPage;