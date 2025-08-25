import { Alert, Button, Card, Checkbox, Col, Divider, Input, InputNumber, List, message, Modal, Radio, Row, Select, Space, Spin, Table, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apis from '../../apis';
import { useEventBookingData } from '../../hooks/useEventBookingData';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Title, Text, Paragraph } = Typography;

const venueOptions = [
    { value: 'Venue1', label: 'Venue 1' },
    { value: 'Venue2', label: 'Venue 2 ' }
];

const availableSessions = {
    '2025-08-25': ['09:00 - 10:00', '11:00 - 12:00', '14:00 - 15:00'],
    '2025-08-26': ['10:00 - 11:00', '13:00 - 14:00'],
    '2025-08-27': ['09:00 - 10:00', '11:00 - 12:00', '15:00 - 16:00'],
};

const SeatingEvent = () => {
    // const { eventId } = useParams();
    const navigate = useNavigate();
    const { registrantDatas, page, setPage, totalDocs, allData, loading, fetchUserData } = usePaginatedRegistrants(9999, "Registrants2025", "createdAt");

    const eventId = "galaConcert2025"

    // 2. Use the custom hook to fetch all data directly from Firebase
    const { event, seats: flatSeatList, error } = useEventBookingData(eventId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedRow, setTempSelectedRow] = useState(null);
    const [selectedRegistrantName, setSelectedRegistrantName] = useState('');
    const [emailBuyer, setEmailBuyer] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State for user's choices (this is UI state, so it stays in the component)
    const [ticketVenue1Level1, setTicketVenue1Level1] = useState(0);
    const [addOnTicketVenue1Level1, setAddOnTicketVenue1Level1] = useState(0);
    const [ticketVenue1Level2, setTicketVenue1Level2] = useState(0);
    const [addOnTicketVenue1Level2, setAddOnTicketVenue1Level2] = useState(0);
    const [ticketVenue1Level3, setTicketVenue1Level3] = useState(0);
    const [addOnTicketVenue1Level3, setAddOnTicketVenue1Level3] = useState(0);

    const [ticketVenue2Level1, setTicketVenue2Level1] = useState(0);
    const [ticketVenue2Level2, setTicketVenue2Level2] = useState(0);

    const [selectedRegistrant, setSelectedRegistrant] = useState(null);
    const [selectedValueRegistrant, setSelectedValueRegistrant] = useState(null); // <-- Add this line


    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    const [ticketQuantity, setTicketQuantity] = useState(0);
    const [wantsToSelectSeats, setWantsToSelectSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    const columns = [
        {
            title: 'Performer Name',
            key: 'performerName',
            render: (_, record) => {
                const performer = record.performers[0];
                return `${performer?.firstName || ''} ${performer?.lastName || ''}`;
            },
            // Enable searching by performer name
            onFilter: (value, record) => {
                const performer = record.performers[0];
                const fullName = `${performer?.firstName || ''} ${performer?.lastName || ''}`;
                return fullName.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, record) => record.performers[0]?.email,
        },
        {
            title: 'Competition',
            dataIndex: 'competitionCategory',
            key: 'competitionCategory',
        },
        {
            title: 'Instrument',
            dataIndex: 'instrumentCategory',
            key: 'instrumentCategory',
        },
        {
            title: 'Age Category',
            dataIndex: 'ageCategory',
            key: 'ageCategory',
        },
    ];

    const filteredData = useMemo(() => {
        if (!registrantDatas) return [];
        if (!searchTerm) {
            return registrantDatas; // If no search term, return all data
        }
        return registrantDatas.filter(registrant => {
            const performer = registrant.performers?.[0];
            if (!performer) return false;

            const fullName = `${performer.firstName} ${performer.lastName}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });
    }, [registrantDatas, searchTerm]);

    const rowSelection = {
        type: 'radio', // Allow only one selection at a time
        onChange: (selectedRowKeys, selectedRows) => {
            // Store the full selected registrant object temporarily
            setTempSelectedRow(selectedRows[0]);
        },
    };

    // --- Modal Controls ---
    const showModal = () => setIsModalOpen(true);

    const handleModalConfirm = () => {
        if (tempSelectedRow) {
            const performer = tempSelectedRow.performers[0];
            // Set the final state with the selected user's info
            setSelectedRegistrantName(`${performer.firstName} ${performer.lastName}`);
            setEmailBuyer(performer.email);
        }
        setIsModalOpen(false); // Close the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // UI Event Handlers - these remain the same
    const handleTicketQuantityChange1 = (value) => {
        setTicketVenue1Level1(value);
        setSelectedSeats([]);
    };
    const handleAddsOnTicketQuantityChange1 = (value) => {
        setAddOnTicketVenue1Level1(value);
        setSelectedSeats([]);
    };

    const handleTicketQuantityChange2 = (value) => {
        setTicketVenue1Level2(value);
        setSelectedSeats([]);
    };
    const handleTicketQuantityChange3 = (value) => {
        setTicketVenue1Level3(value);
        setSelectedSeats([]);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedSession(null); // Reset session when date changes
        // setWantsToSelectSeats(false); // Reset seat selection
    };

    const handleSessionChange = (e) => {
        setSelectedSession(e.target.value);
        // setWantsToSelectSeats(false); // Reset seat selection
    };

    const handleAddOnCheckboxChange = (e, addOn) => {
        if (e.target.checked) setSelectedAddOns(prev => [...prev, addOn]);
        else setSelectedAddOns(prev => prev.filter(item => item.id !== addOn.id));
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
            const response = await apis.bookings.create(bookingPayload);

            message.success({ content: 'Booking initiated!', key: 'booking' });

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


    // --- Render Logic ---
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spin size="large" tip="Loading Event..." /></div>;
    }

    if (error || !event) {
        return <Alert message="Error" description="Could not load event data. Please try again later." type="error" showIcon />;
    }

    return (
        <>

            <Row gutter={[32, 32]} style={{ padding: '40px' }}>
                <Col xs={24} md={14}>
                    <Title level={2}>{event.title}</Title>
                    <Paragraph>{new Date(event.date?.seconds * 1000).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Paragraph>
                    <Divider />

                    <Card title="1. Select Registrant" style={{ marginBottom: '24px' }}>
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Text strong>
                                    {selectedRegistrantName ? `Selected: ${selectedRegistrantName}` : 'No Registrant Selected'}
                                </Text>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={showModal}>
                                    Select Registrant
                                </Button>
                            </Col>
                        </Row>
                        <Row align="middle" justify="space-between" style={{ marginTop: 16 }}>
                            <Paragraph type="secondary">The link to select a seat will be sent to this address.</Paragraph>
                            <Input
                                placeholder="Registrant email will appear here"
                                value={emailBuyer}
                                size="large"
                                disabled={true}
                            />
                        </Row>
                    </Card>

                    <Card title="2. Select Venue" style={{ marginBottom: '24px' }}>
                        <Row align="middle" justify="space-between">
                            <Col><Text>Selection Venue</Text></Col>
                            <Col>
                                <Select
                                    showSearch
                                    style={{ width: 250 }}
                                    placeholder="Search to Select a Venue"
                                    optionFilterProp="label"
                                    // onChange={handleChange}
                                    options={venueOptions}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card title="3. Select Your Tickets" style={{ marginBottom: '24px' }}>
                        <Row align="middle" justify="space-between">
                            <Col><Text>Lento (Base Price: ${event.baseTicketPrice})</Text></Col>
                            <Col><InputNumber min={1} max={10} value={ticketVenue1Level1} onChange={handleTicketQuantityChange1} /> </Col>
                        </Row>
                        {ticketVenue1Level1 > 0 && (
                            <Row align="middle" justify="space-between">
                                <Checkbox checked={wantsToSelectSeats} onChange={(e) => setWantsToSelectSeats(e.target.checked)}>
                                    I want to choose my specific seat (additional charges apply).
                                </Checkbox>
                                {wantsToSelectSeats && (
                                    <Col> <InputNumber min={1} max={10} value={addOnTicketVenue1Level1} onChange={handleAddsOnTicketQuantityChange1} /> </Col>
                                )}
                            </Row>
                        )}

                        <Row className='mt-2' align="middle" justify="space-between">
                            <Col><Text>Allegro (Base Price: ${event.baseTicketPrice})</Text></Col>
                            <Col><InputNumber min={1} max={10} value={ticketVenue1Level2} onChange={handleTicketQuantityChange2} /></Col>
                        </Row>
                        <Row className='mt-2' align="middle" justify="space-between">
                            <Col><Text>Presto (Base Price: ${event.baseTicketPrice})</Text></Col>
                            <Col><InputNumber min={1} max={10} value={ticketVenue1Level3} onChange={handleTicketQuantityChange3} /></Col>
                        </Row>
                    </Card>

                    <Card title="4. Select Date & Session" style={{ marginBottom: '24px' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>

                            {/* --- 1. Date Selection --- */}
                            <div>
                                <Text strong>Select a Date</Text>
                                <Radio.Group
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    style={{ marginTop: '10px' }}
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    {Object.keys(availableSessions).map(date => (
                                        <Radio.Button key={date} value={date}>
                                            {new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </div>

                            {/* --- 2. Session Selection (Only shows after a date is selected) --- */}
                            {selectedDate && (
                                <div>
                                    <Text strong>Select a Session for {new Date(selectedDate).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}</Text>
                                    <Radio.Group
                                        onChange={handleSessionChange}
                                        value={selectedSession}
                                        style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                                        optionType="button"
                                    >
                                        {availableSessions[selectedDate].map(session => (
                                            <Radio.Button key={session} value={session}>
                                                {session}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </div>
                            )}

                        </Space>
                    </Card>

                    <Card title="5. Optional Packages" style={{ marginBottom: '24px' }}>
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
            <Modal
                title="Select a Registrant"
                open={isModalOpen}
                onOk={handleModalConfirm}
                onCancel={handleCloseModal}
                width={1000} // Make the modal wider to fit the table
                okText="Select"
                okButtonProps={{ disabled: !tempSelectedRow }} // Disable OK if nothing is selected
            >
                <Input.Search
                    placeholder="Search by performer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Live search as you type
                    style={{ marginBottom: 16 }}
                    allowClear
                />
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    // dataSource={registrantDatas.map(item => ({ ...item, key: item.id }))} // Add a unique 'key' for each row
                    dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
                    pagination={{ pageSize: 5 }} // Optional: Paginate for long lists
                />
            </Modal>
        </>
    );
};

export default SeatingEvent;