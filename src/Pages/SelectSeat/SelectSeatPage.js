import { Button, Card, Carousel, Divider, List, Result, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../apis';
import venue1_1 from "../../assets/images/venue1_1.png";
import venue1_2 from "../../assets/images/venue1_2.png";
import venue2 from "../../assets/images/venue2.jpeg";
import CustomSeatPicker from './CustomSeatPicker';

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

    // This object maps venue IDs to their corresponding image URLs
    const venueImages = {
        Venue1: [
            venue1_1,
            venue1_2,
        ],
        Venue2: [
            venue2
        ],
        // Add other venues as needed
    };

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

    // console.log("seatLayout", seatLayout)

    // --- Memos for calculating required seats and filtering layouts ---
    const totalRequiredSeats = useMemo(() => {
        if (!bookingData) return 0;
        return bookingData.tickets.reduce((total, ticket) => total + (ticket.wantsSeat ? ticket.seatQuantity : 0), 0);
    }, [bookingData]);

    const totalSelectedSeats = useMemo(() => {
        return Object.values(selections).reduce((total, arr) => total + arr.length, 0);
    }, [selections]);


    const handleSelectSeat = (ticketId, seat) => {
        setSelections(prev => ({ ...prev, [ticketId]: [...prev[ticketId], seat] }));
    };
    const handleDeselectSeat = (ticketId, seat) => {
        setSelections(prev => ({ ...prev, [ticketId]: prev[ticketId].filter(s => s.id !== seat.id) }));
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
            await apis.bookings.confirmSeatSelection({ eventId: "APCS2025", bookingId: bookingData.id, selectedSeatIds: allSelectedIds });
            message.success('Seats confirmed successfully!');
            // navigate('/booking-complete');
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to confirm seats.');
        } finally {
            setIsLoading(false);
        }
    };

    const formattedLayouts = useMemo(() => {
        // Make sure to add bookingData to the dependency array and check for it
        if (!seatLayout || seatLayout.length === 0 || !bookingData) return {};

        const seatsForCorrectVenue = seatLayout.filter(seat => seat.venueId === bookingData.venue);

        const groupedByArea = seatsForCorrectVenue.reduce((acc, seat) => {
            const area = seat.areaType;
            if (!acc[area]) acc[area] = [];
            acc[area].push(seat);
            return acc;
        }, {});

        const finalLayouts = {};

        // --- THIS IS THE SORTING LOGIC ---
        // 1. Define your desired custom sort order.
        const areaOrder = ['presto', 'allegro', 'lento'];

        // 2. Loop through your custom order array instead of the object keys.
        areaOrder.forEach(area => {
            // Make sure the area actually exists in your data before processing it
            if (groupedByArea[area]) {
                const rowsObject = groupedByArea[area].reduce((acc, seat) => {
                    const row = seat.row;
                    if (!acc[row]) acc[row] = [];
                    acc[row].push(seat);
                    return acc;
                }, {});

                const sortedRowKeys = Object.keys(rowsObject).sort((a, b) => a.localeCompare(b));

                finalLayouts[area] = sortedRowKeys.map(rowKey => {
                    const rowSeats = rowsObject[rowKey];
                    rowSeats.sort((a, b) => a.number - b.number);
                    return rowSeats.map(seat => ({
                        id: seat.id,
                        number: seat.number,
                        isReserved: seat.status !== 'available',
                        tooltip: `Seat ${seat.seatLabel} - ${seat.areaType.charAt(0).toUpperCase() + seat.areaType.slice(1)}`
                    }));
                });
            }
        });
        // --- END OF SORTING LOGIC ---

        return finalLayouts;
    }, [seatLayout, bookingData]); // The dependency array must include bookingData


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

            <Card style={{ maxWidth: 900, margin: '20px auto 0' }}>
                <Title level={3}>Venue Layout</Title>
                <Divider />
                <Carousel arrows autoplay className="custom-carousel">
                    {(venueImages[bookingData?.venue] || []).map((imgUrl, index) => (
                        <div key={index}>
                            <img
                                src={imgUrl}
                                alt={`${bookingData?.venue} - Image ${index + 1}`}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </Carousel>
            </Card>

            {bookingData?.tickets.map(ticket => {
                if (!ticket.wantsSeat || ticket.seatQuantity === 0) return null;

                const layoutForPicker = formattedLayouts[ticket.id] || [];

                return (
                    <Card key={ticket.id} title={`Select ${ticket.seatQuantity} Seat(s) for ${ticket.name}`} style={{ maxWidth: 900, margin: '20px auto 0' }}>
                        <div style={{ overflowX: 'auto', padding: '10px' }}>
                            <CustomSeatPicker
                                layout={layoutForPicker}
                                selectedSeats={selections[ticket.id] || []}
                                onSelect={(seat) => handleSelectSeat(ticket.id, seat)}
                                onDeselect={(seat) => handleDeselectSeat(ticket.id, seat)}
                                maxSeats={ticket.seatQuantity}
                            />
                        </div>
                        {/* --- END OF CUSTOM COMPONENT USAGE --- */}

                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <Text strong>Selected: {selections[ticket.id]?.map(s => s.tooltip).join(', ') || 'None'}</Text>
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