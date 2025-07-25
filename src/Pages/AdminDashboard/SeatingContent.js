import { Alert, Button, Card, Checkbox, Col, Divider, Input, InputNumber, List, message, Row, Spin, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatPicker from 'react-seat-picker';
import apis from '../../apis';
import { useEventBookingData } from '../../hooks/useEventBookingData';

const { Title, Text, Paragraph } = Typography;

const SeatingContent = () => {
    // const { eventId } = useParams();
    const navigate = useNavigate();

    const eventId = "galaConcert2025"

    // 2. Use the custom hook to fetch all data directly from Firebase
    const { event, seats: flatSeatList, loading, error } = useEventBookingData(eventId);

    // State for user's choices (this is UI state, so it stays in the component)
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [wantsToSelectSeats, setWantsToSelectSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [emailBuyer, setEmailBuyer] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    // Memoize the formatted seats for the SeatPicker to avoid re-calculating on every render
    const formattedSeatsForPicker = useMemo(() => {
        if (!flatSeatList) return [];
        const rows = flatSeatList.reduce((acc, seat) => {
            const { row, number, status, id, areaType, rowType } = seat;
            const price = event?.pricingTiers[areaType]?.[rowType] || 0;
            if (!acc[row]) acc[row] = [];
            acc[row].push({ id, number, isReserved: status === 'reserved', tooltip: `+ $${price}` });
            return acc;
        }, {});
        // Ensure rows are sorted and add nulls for aisles if needed
        return Object.keys(rows).sort().map(key => rows[key].sort((a, b) => a.number - b.number));
    }, [flatSeatList, event]);

    // Calculation logic - this remains the same
    const orderSummary = useMemo(() => {
        if (!event) return { items: [], total: 0 };
        const items = [];
        let total = 0;
        items.push({ description: `General Admission Ticket`, quantity: ticketQuantity, price: event.baseTicketPrice * ticketQuantity });
        total += event.baseTicketPrice * ticketQuantity;
        selectedSeats.forEach(seat => {
            items.push({ description: `Seat Reservation (${seat.label})`, quantity: 1, price: seat.price });
            total += seat.price;
        });
        selectedAddOns.forEach(addOn => {
            items.push({ description: addOn.name, quantity: 1, price: addOn.price });
            total += addOn.price;
        });
        return { items, total };
    }, [event, ticketQuantity, selectedSeats, selectedAddOns]);


    // UI Event Handlers - these remain the same
    const handleTicketQuantityChange = (value) => {
        setTicketQuantity(value);
        setSelectedSeats([]);
    };
    const handleAddOnCheckboxChange = (e, addOn) => {
        if (e.target.checked) setSelectedAddOns(prev => [...prev, addOn]);
        else setSelectedAddOns(prev => prev.filter(item => item.id !== addOn.id));
    };


    // Seat Picker Callbacks
    const addSeatCallback = ({ row, number, id }, addCb) => {
        const seatData = flatSeatList.find(s => s.id === id);
        if (!seatData || !event) return;

        const seatPrice = event.pricingTiers[seatData.areaType]?.[seatData.rowType] || 0;
        const newSeat = { id: seatData.id, label: seatData.seatLabel, price: seatPrice };

        setSelectedSeats(prev => [...prev, newSeat]);
        addCb(row, number, id);
    };
    const removeSeatCallback = ({ row, number, id }, removeCb) => {
        setSelectedSeats(prev => prev.filter(seat => seat.id !== id));
        removeCb(row, number);
    };

    // --- Final Submission ---
    // IMPORTANT: This function still calls our secure Node.js backend
    // It does NOT write directly to Firebase from the client.
    const handleContinueToPayment = async () => {
        if (!emailBuyer) {
            message.error('Please enter your email address.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(emailBuyer)) {
            message.error('Please enter a valid email address.');
            return;
        }

        if (wantsToSelectSeats && selectedSeats.length !== ticketQuantity) {
            message.error(`You must select ${ticketQuantity} seat(s) to match the number of tickets.`);
            return;
        }

        // This is the secure payload for our backend
        const bookingPayload = {
            eventId: eventId,
            userEmail: emailBuyer,
            ticketQuantity: ticketQuantity,
            selectedSeatIds: selectedSeats.length <= 0 ? null : selectedSeats.map(s => s.id),
            selectedAddOnIds: selectedAddOns.length <= 0 ? null : selectedAddOns.map(a => a.id),
        };

        try {
            message.loading({ content: 'Initiating your booking...', key: 'booking' });
            // The ONLY backend call in this component, for the secure operation.
            console.log("hit api", bookingPayload)
            const response = await apis.bookings.create(bookingPayload);

            message.success({ content: 'Booking initiated!', key: 'booking' });

            console.log("move page", response)
            // Navigate to payment page with all the necessary data
            navigate('/payment', {
                state: {
                    orderSummary: orderSummary,
                    qrisString: response.data.qrisString, // From backend
                    bookingId: response.data.bookingId, // From backend
                }
            });

        } catch (err) {
            message.error({ content: err.response?.data?.message || 'Failed to create booking.', key: 'booking' });
            console.error("Booking creation failed:", err);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spin size="large" tip="Loading Event..." /></div>;
    }

    if (error || !event) {
        return <Alert message="Error" description="Could not load event data. Please try again later." type="error" showIcon />;
    }

    return (
        <Row gutter={[32, 32]} style={{ padding: '40px' }}>
            <Col xs={24} md={14}>
                <Title level={2}>{event.title}</Title>
                <Paragraph>{new Date(event.date?.seconds * 1000).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Paragraph>
                <Divider />

                <Card title="1. Select Your Tickets" style={{ marginBottom: '24px' }}>
                    <Row align="middle" justify="space-between">
                        <Col><Text>General Admission (Base Price: ${event.baseTicketPrice})</Text></Col>
                        <Col><InputNumber min={1} max={10} value={ticketQuantity} onChange={handleTicketQuantityChange} /></Col>
                    </Row>
                </Card>

                <Card title="2. Choose Your Seats (Optional)" style={{ marginBottom: '24px' }}>
                    <Checkbox checked={wantsToSelectSeats} onChange={(e) => setWantsToSelectSeats(e.target.checked)}>
                        I want to choose my specific seat (additional charges apply).
                    </Checkbox>
                    {wantsToSelectSeats && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            {formattedSeatsForPicker.length > 0 ? (
                                <SeatPicker
                                    addSeatCallback={addSeatCallback}
                                    removeSeatCallback={removeSeatCallback}
                                    rows={formattedSeatsForPicker}
                                    maxReservableSeats={ticketQuantity}
                                    alpha
                                    visible
                                    selectedByDefault
                                />
                            ) : <Spin />}
                        </div>
                    )}
                </Card>

                <Card title="3. Optional Packages">
                    <List
                        dataSource={event.addOns}
                        renderItem={item => (
                            <List.Item>
                                <Checkbox onChange={(e) => handleAddOnCheckboxChange(e, item)}>
                                    {item.name} (+${item.price})
                                </Checkbox>
                            </List.Item>
                        )}
                    />
                </Card>

                <Card title="4. Your Email Address">
                    <Paragraph type="secondary">Your e-ticket will be sent to this address.</Paragraph>
                    <Input
                        placeholder="Enter your email"
                        value={emailBuyer}
                        onChange={(e) => setEmailBuyer(e.target.value)}
                        size="large"
                    />
                </Card>
            </Col>

            <Col xs={24} md={10}>
                <Card style={{ position: 'sticky', top: '20px' }}>
                    <Title level={4}>Order Summary</Title>
                    <List
                        dataSource={orderSummary.items}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.description}
                                    description={item.quantity > 1 ? `Quantity: ${item.quantity}` : ''}
                                />
                                <Text>${item.price}</Text>
                            </List.Item>
                        )}
                        style={{ minHeight: '150px' }}
                    />
                    <Divider />
                    <Row justify="space-between">
                        <Col><Title level={3}>Total</Title></Col>
                        <Col><Title level={3}>${orderSummary.total}</Title></Col>
                    </Row>
                    <Button type="primary" size="large" block onClick={handleContinueToPayment} disabled={loading}>
                        Continue to Payment
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default SeatingContent;