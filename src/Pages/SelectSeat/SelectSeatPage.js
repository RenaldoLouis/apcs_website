import { Button, Card, Divider, List, Result, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatPicker from 'react-seat-picker';
import apis from '../../apis';

const { Title, Text, Paragraph } = Typography;

const SelectSeatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [seatLayout, setSeatLayout] = useState([]); // This will hold the single, flat list from the backend
    const [isLoading, setIsLoading] = useState(false);
    // const { userData, loading, error, refetch } = useFetchSeatBookData("seatBook2025", documentId,);

    // State to hold selections for EACH ticket type separately
    const [selections, setSelections] = useState({});

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            setStatus('invalid');
            setErrorMessage('No selection token found.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await apis.bookings.verifySeatToken({ token });
                const backendBookingData = response.data.bookingData;

                setBookingData(backendBookingData);
                setSeatLayout(response.data.seatLayout);

                // Initialize the selections state based on the tickets that require seat selection
                const initialSelections = {};
                backendBookingData.tickets.forEach(ticket => {
                    if (ticket.wantsSeat && ticket.seatQuantity > 0) {
                        initialSelections[ticket.id] = [];
                    }
                });
                setSelections(initialSelections);

                setStatus('valid');
            } catch (err) {
                setStatus('invalid');
                setErrorMessage(err.response?.data?.message || 'An error occurred.');
            }
        };

        verifyToken();
    }, [location]);

    console.log("seatLayout", seatLayout)

    // --- Memos for calculating required seats and filtering layouts ---
    const totalRequiredSeats = useMemo(() => {
        if (!bookingData) return 0;
        return bookingData.tickets.reduce((total, ticket) => total + (ticket.wantsSeat ? ticket.seatQuantity : 0), 0);
    }, [bookingData]);

    const totalSelectedSeats = useMemo(() => {
        return Object.values(selections).reduce((total, arr) => total + arr.length, 0);
    }, [selections]);

    const filteredLayouts = useMemo(() => {
        if (!seatLayout) return {};
        // This groups the flat seat list from the backend into separate layouts by areaType
        return seatLayout.reduce((acc, seat) => {
            const area = seat.areaType;
            if (!acc[area]) acc[area] = {};
            if (!acc[area][seat.row]) acc[area][seat.row] = [];
            acc[area][seat.row].push({ ...seat, isReserved: seat.status !== 'available' });
            return acc;
        }, {});
    }, [seatLayout]);

    // --- Generic handlers for adding/removing seats ---
    const handleAddSeat = (ticketId, { row, number, id }, addCb) => {
        setSelections(prev => ({ ...prev, [ticketId]: [...prev[ticketId], { row, number, id }] }));
        addCb(row, number, id);
    };

    const handleRemoveSeat = (ticketId, { row, number, id }, removeCb) => {
        setSelections(prev => ({ ...prev, [ticketId]: prev[ticketId].filter(seat => seat.id !== id) }));
        removeCb(row, number);
    };

    // --- Submission Logic ---
    const handleConfirmSelection = async () => {
        if (totalSelectedSeats !== totalRequiredSeats) {
            message.warn(`Please select exactly ${totalRequiredSeats} seat(s) in total.`);
            return;
        }

        setIsLoading(true);
        try {
            const allSelectedIds = Object.values(selections).flat().map(seat => seat.id);
            await apis.bookings.confirmSeats({ bookingId: bookingData.id, selectedSeatIds: allSelectedIds });
            message.success('Seats confirmed successfully!');
            navigate('/booking-complete');
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to confirm seats.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Conditional Rendering ---
    if (status === 'verifying') {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin tip="Verifying your link..." size="large" /></div>;
    }

    if (status === 'invalid') {
        return (
            // 1. Full-screen wrapper
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Result
                    status="error"
                    // 2. Apply className to Typography components
                    title={
                        <Typography.Title level={2} style={{ color: '#EBBC64' }}>
                            Link Expired or Invalid
                        </Typography.Title>
                    }
                    subTitle={
                        <Typography.Paragraph className="goldenTextColor">
                            Please check your email for a seat confirmation. If you have not selected your seats, the link you used may have expired. Please contact our admin for assistance.
                        </Typography.Paragraph>
                    }
                    extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Card style={{ maxWidth: 900, margin: '0 auto' }}>
                <Title level={3}>Seat Selection</Title>
                <Paragraph><strong>Booking for:</strong> {bookingData?.userName}</Paragraph>
                <Paragraph><strong>Venue:</strong> {bookingData?.venue} | <strong>Date:</strong> {bookingData?.date} at {bookingData?.session}</Paragraph>
                <Divider />
                <Title level={5}>Your Tickets Requiring Seat Selection:</Title>
                <List
                    dataSource={bookingData?.tickets.filter(t => t.wantsSeat && t.seatQuantity > 0)}
                    renderItem={item => (<List.Item>• {item.seatQuantity} x Seat Selection for {item.name}</List.Item>)}
                    bordered
                    size="small"
                />
            </Card>

            {bookingData?.tickets.map(ticket => {
                if (!ticket.wantsSeat || ticket.seatQuantity === 0) return null;

                const layoutForPicker = Object.values(filteredLayouts[ticket.id] || {});

                return (
                    <Card key={ticket.id} title={`Select ${ticket.seatQuantity} Seat(s) for ${ticket.name}`} style={{ maxWidth: 900, margin: '20px auto 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <SeatPicker
                                rows={layoutForPicker}
                                maxReservableSeats={ticket.seatQuantity}
                                alpha
                                visible
                                addSeatCallback={(...args) => handleAddSeat(ticket.id, ...args)}
                                removeSeatCallback={(...args) => handleRemoveSeat(ticket.id, ...args)}
                            />
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <Text strong>Selected: {selections[ticket.id]?.map(s => `${s.row}${s.number}`).join(', ') || 'None'}</Text>
                        </div>
                    </Card>
                );
            })}

            <Card style={{ maxWidth: 900, margin: '20px auto 0', textAlign: 'center' }}>
                <Title level={4}>Total Selected Seats: {totalSelectedSeats} / {totalRequiredSeats}</Title>
                <Button
                    type="primary"
                    size="large"
                    style={{ marginTop: '20px' }}
                    onClick={handleConfirmSelection}
                    loading={isLoading}
                    disabled={totalSelectedSeats !== totalRequiredSeats}
                >
                    Confirm Final Selection
                </Button>
            </Card>
        </div>
    );
};

export default SelectSeatPage;