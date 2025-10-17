import { Button, Card, Carousel, Divider, Image, List, Result, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../apis';
import jatayu from "../../assets/images/jatayu_Map.png";
import melati from "../../assets/images/Melati_Map.png";
import CustomSeatPicker from './CustomSeatPicker';
const { Title, Text, Paragraph } = Typography;

const SelectSeatPage = () => {
    const areaOrder = ['presto', 'allegro', 'lento'];
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [seatLayout, setSeatLayout] = useState([]); // This will hold the single, flat list from the backend
    const [isLoading, setIsLoading] = useState(false);

    // State to hold selections for EACH ticket type separately
    const [selections, setSelections] = useState({});

    // This object maps venue IDs to their corresponding image URLs
    const venueImages = {
        Venue1: [
            jatayu,
        ],
        Venue2: [
            melati
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
            const response = await apis.bookings.confirmSeatSelection({
                eventId: "APCS2025",
                bookingId: bookingData.id,
                selectedSeatIds: allSelectedIds
            });

            if (response.status !== 200) {
                throw Error(response.data.message)
            }

            message.success('Seats confirmed successfully!');

            // --- THIS IS THE NEW SUCCESS LOGIC ---
            // Navigate to the success page after confirmation
            navigate('/booking-complete');

        } catch (err) {
            // --- THIS IS THE NEW ERROR LOGIC ---
            // Show a more specific error message to the user
            const errorMessage = err.response?.data?.message || 'Failed to confirm seats.';
            message.error(`${errorMessage} The page will now refresh in 5 seconds.`, 5); // Show message for 5 seconds

            // Force a page refresh after a delay so the user can read the message
            setTimeout(() => {
                window.location.reload();
            }, 5000); // 5-second delay before refresh

        }
        setIsLoading(false);
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
                    rowSeats.sort((a, b) => b.number - a.number);
                    return rowSeats.map(seat => ({
                        id: seat.id,
                        number: seat.number,
                        row: seat.row,
                        isReserved: seat.status !== 'available',
                        tooltip: `Seat ${seat.seatLabel} - ${seat.areaType.charAt(0).toUpperCase() + seat.areaType.slice(1)}`
                    }));
                });
            }
        });
        // --- END OF SORTING LOGIC ---

        if (bookingData.venue === 'Venue1') {
            const exclusionRanges = [
                { row: 'A', start: 30, end: 40 },
                { row: 'A', start: 1, end: 11 },
                { row: 'A', start: 20, end: 21 },
                { row: 'B', start: 1, end: 11 },
                { row: 'B', start: 19, end: 21 },
                { row: 'C', start: 1, end: 11 },
                { row: 'C', start: 33, end: 43 },
                { row: 'D', start: 1, end: 11 },
                { row: 'D', start: 33, end: 42 },
                { row: 'E', start: 35, end: 43 },
                { row: 'F', start: 35, end: 43 },
            ];

            // Loop through each area (presto, allegro, lento)
            for (const area in finalLayouts) {
                // Loop through each row of seats (A, B, C...)
                finalLayouts[area] = finalLayouts[area].map(row => {
                    // Filter the seats in the current row
                    return row.filter(seat => {
                        // Check if this seat is in any of the exclusion ranges
                        const isExcluded = exclusionRanges.some(range =>
                            seat.row === range.row && seat.number >= range.start && seat.number <= range.end
                        );
                        // Keep the seat only if it is NOT excluded
                        return !isExcluded;
                    });
                }).filter(row => row.length > 0); // Remove any rows that are now empty
            }
        } else if (bookingData.venue === 'Venue2') {
            // --- NEW: Add exclusion ranges specifically for Venue2 ---
            const exclusionRanges = [
                { row: 'A', start: 23, end: 30 },
                { row: 'B', start: 23, end: 30 },
                { row: 'C', start: 23, end: 30 },
                { row: 'D', start: 23, end: 30 },
                { row: 'E', start: 24, end: 32 },
                { row: 'F', start: 24, end: 32 },
                { row: 'A', start: 14, end: 17 },
                { row: 'B', start: 15, end: 16 },
                { row: 'A', start: 1, end: 8 },
                { row: 'B', start: 1, end: 8 },
                { row: 'C', start: 1, end: 8 },
            ];

            // Apply the filter for Venue2
            for (const area in finalLayouts) {
                finalLayouts[area] = finalLayouts[area].map(row => {
                    return row.filter(seat => {
                        const isExcluded = exclusionRanges.some(range =>
                            seat.row === range.row && seat.number >= range.start && seat.number <= range.end
                        );
                        return !isExcluded;
                    });
                }).filter(row => row.length > 0);
            }
        }

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
                <Paragraph><strong>Venue:</strong> {bookingData?.venue === "Venue1" ? "jatayu" : "Melati"} | <strong>Date:</strong> {bookingData?.date} at {bookingData?.session}</Paragraph>
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
                <Image.PreviewGroup>
                    <Carousel autoplay className="custom-carousel">
                        {(venueImages[bookingData?.venue] || []).map((imgUrl, index) => (
                            <div key={index}>
                                {/* 2. Replace the standard <img> tag with Ant Design's <Image> component */}
                                <Image
                                    preview={true} // This hides the default magnifying glass icon
                                    src={imgUrl}
                                    alt={`${bookingData?.venue} - Image ${index + 1}`}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </Image.PreviewGroup>
            </Card>

            {
                [...(bookingData?.tickets || [])]
                    .sort((a, b) => areaOrder.indexOf(a.id) - areaOrder.indexOf(b.id))
                    .map(ticket => {
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
                                        onSeatClick={null} // onSeatClick is explicitly null for user selection mode
                                    />
                                </div>
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