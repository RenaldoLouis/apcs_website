import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Typography
} from 'antd';
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import apis from '../../apis';
import { db } from '../../firebase';
import { useEventBookingData } from '../../hooks/useEventBookingData';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';
import CustomSeatPicker from '../SelectSeat/CustomSeatPicker';

const { Title, Text, Paragraph } = Typography;

// --- Component Constants ---
const venueOptions = [
    { value: 'Venue1', label: 'Jatayu' },
    { value: 'Venue2', label: 'Melati' }
];

const availableSessionsVenue1 = {
    '2025-08-25': ['09:00-10:00', '11:00-12:00', '14:00-15:00'],
    '2025-08-26': ['10:00-11:00', '13:00-14:00'],
};

const availableSessionsVenue2 = {
    '2025-08-25': ['09:00-10:00', '11:00-12:00'],
    '2025-08-26': ['10:00-11:00', '13:00-14:00'],
};

const EVENT_SESSIONS_VENUE1 = [
    "2025-08-25_09:00-10:00",
    "2025-08-25_11:00-12:00",
    "2025-08-25_14:00-15:00",
    "2025-08-26_10:00-11:00",
    "2025-08-26_13:00-14:00",
];

const EVENT_SESSIONS_VENUE2 = [
    "2025-08-25_09:00-10:00",
    "2025-08-25_11:00-12:00",
    "2025-08-26_10:00-11:00",
    "2025-08-26_13:00-14:00",
];

const venueLayoutConfigs = {
    // JATAYU
    'Venue1': [
        // Presto Section
        { row: 'A', areaType: 'presto', seats: [[8, 23]] },
        { row: 'B', areaType: 'presto', seats: [[8, 23]] },
        { row: 'C', areaType: 'presto', seats: [[8, 23]] },
        // Allegro Section
        { row: 'C', areaType: 'allegro', seats: [[1, 7], [24, 30]] },
        { row: 'D', areaType: 'allegro', seats: [[1, 30]] },
        { row: 'E', areaType: 'allegro', seats: [[8, 23]] },
        // Lento Section
        { row: 'E', areaType: 'lento', seats: [[1, 7], [24, 30]] },
        { row: 'F', areaType: 'lento', seats: [[1, 30]] },
    ],
    'Venue2': [
        // Lento Section
        { row: 'A', areaType: 'lento', seats: [[1, 28]] },
        { row: 'B', areaType: 'lento', seats: [[1, 30]] },
        { row: 'C', areaType: 'lento', seats: [[1, 30]] },
    ],
};

/**
 * Generates a flat array of seat objects for a single section's layout.
 * @returns {Array<object>} An array of seat "template" objects.
 */
const generateSeatLayoutTemplates = (venueId) => {
    const seatLayoutConfig = venueLayoutConfigs[venueId];
    if (!seatLayoutConfig) {
        console.error(`No layout configuration found for venueId: ${venueId}`);
        return [];
    }

    const seats = [];
    seatLayoutConfig.forEach(config => {
        const { row, areaType, seats: seatRanges } = config;
        seatRanges.forEach(range => {
            const [start, end] = range;
            for (let number = start; number <= end; number++) {
                seats.push({
                    seatLabel: `${row}${number}`,
                    areaType,
                    row,
                    number,
                });
            }
        });
    });
    return seats;
};


/**
 * Generates and uploads the full seat availability for all sessions of an event.
 * WARNING: This will CREATE OR OVERWRITE all seat data for the specified event and sessions.
 * @param {string} eventId - The ID of the event.
 * @param {Array<string>} sessions - An array of session identifiers (e.g., "2025-08-25_09:00-10:00").
 */
export const uploadFullSeatLayout = async (eventId, venueId, sessions) => {
    console.log(`Starting to generate seat availability for event: ${eventId}`);
    if (!sessions || sessions.length === 0) {
        console.error("No sessions provided.");
        alert("Error: No sessions provided to generate seats for.");
        return;
    }

    try {
        // 1. Get the physical layout of the venue
        const seatTemplates = generateSeatLayoutTemplates(venueId);
        const allSeatInstances = [];

        // 2. Create a unique document for EACH seat in EACH session
        for (const sessionId of sessions) {
            for (const seatTemplate of seatTemplates) {
                const documentId = `${seatTemplate.areaType}-${seatTemplate.seatLabel}_${eventId}_${sessionId}`;

                allSeatInstances.push({
                    id: documentId, // For the batch operation
                    eventId: eventId,
                    venueId, // Add the venueId to each document
                    sessionId: sessionId,
                    status: 'available',
                    ...seatTemplate
                });
            }
        }
        console.log(`Generated a total of ${allSeatInstances.length} seat instances across ${sessions.length} sessions.`);

        // 3. Use Batched Writes to upload the data efficiently
        const batchSize = 499;
        for (let i = 0; i < allSeatInstances.length; i += batchSize) {
            const batch = writeBatch(db);
            const chunk = allSeatInstances.slice(i, i + batchSize);

            console.log(`Preparing batch ${Math.floor(i / batchSize) + 1}...`);
            chunk.forEach(seat => {
                const docRef = doc(db, `seats${eventId}`, seat.id);
                batch.set(docRef, seat);
            });

            console.log("Committing batch...");
            await batch.commit();
        }

        console.log("✅ Successfully uploaded all seat instances to Firestore!");

    } catch (error) {
        console.error("❌ Error uploading seat layout:", error);
        alert(`An error occurred: ${error.message}`);
    }
};

const SeatingEvent = () => {
    const eventId = "APCS2025";

    // --- Data Fetching Hooks ---
    const { registrantDatas, loading: registrantsLoading } = usePaginatedRegistrants(9999, "Registrants2025", "createdAt");
    const { event, setLoading, loading: eventLoading, error } = useEventBookingData(eventId);

    // --- NEW STATE for the assignment process ---
    const [seatToAssign, setSeatToAssign] = useState(null); // Stores the seat that was clicked
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Controls the registrant modal
    const [registrantToAssign, setRegistrantToAssign] = useState(null); // Stores the registrant selected in the modal

    // --- UI State (for modal, search, etc.) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedRow, setTempSelectedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [seatLayout, setSeatLayout] = useState([]); // This will hold the single, flat list from the backend
    const [isSeatMapLoading, setIsSeatMapLoading] = useState(false);

    // --- React Hook Form Initialization ---
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            registrant: null,
            venue: undefined, // Use undefined for antd placeholder to show
            date: null,
            session: null,
            addOns: [],
            tickets: [
                { id: 'lento', name: 'Lento', basePrice: event?.baseTicketPrice || 50, quantity: 0, wantsSeat: false, seatQuantity: 0 },
                { id: 'allegro', name: 'Allegro', basePrice: event?.baseTicketPrice || 40, quantity: 0, wantsSeat: false, seatQuantity: 0 },
                { id: 'presto', name: 'Presto', basePrice: event?.baseTicketPrice || 30, quantity: 0, wantsSeat: false, seatQuantity: 0 }
            ]
        }
    });

    const { fields } = useFieldArray({ control, name: "tickets" });
    const watchedFormData = watch(); // Watch all form data for reactive UI updates

    // --- Modal Logic ---
    const showModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleModalConfirm = () => {
        if (tempSelectedRow) {
            const performer = tempSelectedRow.performers[0];
            setValue('registrant', {
                id: tempSelectedRow.id,
                name: `${performer.firstName} ${performer.lastName}`,
                email: performer.email
            }, { shouldValidate: true }); // Update form state
        }
        setIsModalOpen(false);
    };

    const filteredData = useMemo(() => {
        if (!registrantDatas) return [];
        if (!searchTerm) return registrantDatas;
        return registrantDatas.filter(registrant => {
            const performer = registrant.performers?.[0];
            if (!performer) return false;
            const fullName = `${performer.firstName} ${performer.lastName}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });
    }, [registrantDatas, searchTerm]);

    useEffect(() => {
        const fetchSeatMap = async () => {
            if (watchedFormData.venue && watchedFormData.date && watchedFormData.session) {
                setIsSeatMapLoading(true);
                try {
                    const sessionId = `${watchedFormData.date}_${watchedFormData.session}`;
                    const q = query(
                        collection(db, `seats${eventId}`),
                        where('venueId', '==', watchedFormData.venue),
                        where('sessionId', '==', sessionId)
                    );
                    const querySnapshot = await getDocs(q);
                    const seats = querySnapshot.docs.map(doc => doc.data());
                    setSeatLayout(seats);
                } catch (err) {
                    console.error("Failed to fetch seat map:", err);
                    message.error("Could not load the seat map for this session.");
                } finally {
                    setIsSeatMapLoading(false);
                }
            } else {
                // If venue/date/session is deselected, clear the map
                setSeatLayout([]);
            }
        };

        fetchSeatMap();
    }, [watchedFormData.venue, watchedFormData.date, watchedFormData.session]);

    const formattedSessionLayout = useMemo(() => {
        if (!seatLayout || seatLayout.length === 0) return {};
        const seatsForCorrectVenue = seatLayout.filter(seat => seat.venueId === watchedFormData.venue);


        // 1. Group all seats by their area (lento, allegro, presto)
        const groupedByArea = seatsForCorrectVenue.reduce((acc, seat) => {
            const area = seat.areaType;
            if (!acc[area]) acc[area] = [];
            acc[area].push(seat);
            return acc;
        }, {});

        const finalLayouts = {};

        // --- THIS IS THE NEW SORTING LOGIC ---
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
                        row: seat.row, // Pass the row letter for custom labels
                        isReserved: seat.status !== 'available',
                        status: seat.status,
                        // --- NEW TOOLTIP LOGIC ---
                        tooltip: seat.status === 'reserved'
                            ? `Reserved for: ${seat.assignedTo?.registrantName || 'N/A'}`
                            : `Seat ${seat.seatLabel} - Available`,
                    }));
                });
            }
        });

        if (!seatLayout || seatLayout.length === 0) return {};
        return finalLayouts;
    }, [seatLayout, watchedFormData.venue]);

    // --- Form Submission ---
    const onFormSubmit = async (formData) => {
        if (!formData.registrant) {
            message.error('Please select a registrant.');
            return;
        }

        const bookingPayload = {
            eventId: eventId,
            userId: formData.registrant.id,
            userName: formData.registrant.name,
            userEmail: formData.registrant.email,
            venue: formData.venue,
            date: formData.date,
            session: formData.session,
            tickets: formData.tickets.filter(t => t.quantity > 0),
            addOns: formData.addOns,
        };

        try {
            message.loading({ content: 'Initiating your booking...', key: 'booking' });
            // 1. Save the booking info and get the token back
            console.log("bookingPayload", bookingPayload)
            const saveResponse = await apis.bookings.saveSeatBookProfileInfo(bookingPayload);
            const { bookingId, seatSelectionToken } = saveResponse.data;

            // 2. Prepare the payload for the email, now including the token
            const emailPayload = {
                ...bookingPayload,
                bookingId: bookingId,
                seatSelectionToken: seatSelectionToken // Add the token here
            };
            console.log("emailPayload", emailPayload)
            // 3. Send the email with the token
            await apis.bookings.sendSeatBookingEmail(emailPayload);
            message.success({ content: 'Booking initiated!', key: 'booking' });
            toast.info("Please check your email to select your seat(s).");
        } catch (err) {
            message.error({ content: err.response?.data?.message || 'Failed to create booking.', key: 'booking' });
        }
    };

    // --- Order Summary Calculation ---
    const orderSummary = useMemo(() => {
        const items = [];
        let total = 0;

        watchedFormData.tickets?.forEach(ticket => {
            if (ticket.quantity > 0) {
                items.push({ description: `${ticket.name} Ticket`, quantity: ticket.quantity, price: ticket.basePrice * ticket.quantity });
                total += ticket.basePrice * ticket.quantity;
            }
            if (ticket.wantsSeat && ticket.seatQuantity > 0) {
                const seatPrice = 10; // Example add-on price
                items.push({ description: `Seat Selection (${ticket.name})`, quantity: ticket.seatQuantity, price: seatPrice * ticket.seatQuantity });
                total += seatPrice * ticket.seatQuantity;
            }
        });

        event?.addOns?.forEach(addOn => {
            if (watchedFormData.addOns?.includes(addOn.id)) {
                items.push({ description: addOn.name, quantity: 1, price: addOn.price });
                total += addOn.price;
            }
        });

        return { items, total };
    }, [watchedFormData, event]);

    // --- NEW HANDLERS for the assignment flow ---
    const handleSeatClick = (seat) => {
        console.log("seat", seat)
        if (seat.status !== 'available') {
            message.info(`Seat ${seat.seatLabel} is already reserved for ${seat.assignedTo?.registrantName || 'someone'}.`);
            return;
        }
        setSeatToAssign(seat);
        setIsAssignModalOpen(true);
    };

    const handleAssignModalCancel = () => {
        setIsAssignModalOpen(false);
        setSeatToAssign(null);
        setRegistrantToAssign(null);
    };

    const handleAssignModalConfirm = async () => {
        if (!seatToAssign || !registrantToAssign) {
            message.error("No seat or registrant was selected.");
            return;
        }

        message.loading({ content: 'Assigning seat...', key: 'assignSeat' });
        try {
            const docRef = doc(db, `seats${eventId}`, seatToAssign.id);

            // Update the seat document in Firestore
            await updateDoc(docRef, {
                status: 'reserved',
                assignedTo: {
                    registrantId: registrantToAssign.id,
                    registrantName: `${registrantToAssign.performers[0].firstName} ${registrantToAssign.performers[0].lastName}`,
                    registrantEmail: registrantToAssign.performers[0].email // Add the email here
                }
            });

            message.success({ content: `Seat ${seatToAssign.seatLabel} assigned successfully!`, key: 'assignSeat' });

            // Refresh the seat map by re-fetching the data
            // You might need to extract your `fetchSeatMap` logic into a useCallback
            // For simplicity here, we'll just re-trigger it by briefly clearing state
            setSeatLayout([]);
            // This will cause the useEffect to re-fetch the updated seat map.

            handleAssignModalCancel(); // Close and reset
        } catch (error) {
            console.error("Failed to assign seat:", error);
            message.error({ content: 'Failed to assign seat.', key: 'assignSeat' });
        }
    };

    const handleUploadClick = async () => {
        setLoading(true);
        message.info('Starting full seat layout upload for all venues and sessions...');

        // Upload layout for Venue 1
        await uploadFullSeatLayout('APCS2025', 'Venue1', EVENT_SESSIONS_VENUE1);

        // Upload layout for Venue 2
        await uploadFullSeatLayout('APCS2025', 'Venue2', EVENT_SESSIONS_VENUE2);

        setLoading(false);
        message.success('All layouts uploaded successfully!');
    };

    const availableSession = useMemo(() => {
        if (watchedFormData.venue === "Venue1") {
            return availableSessionsVenue1
        } else {
            return availableSessionsVenue2
        }
    }, [watchedFormData.venue])

    // --- Loading and Error States ---
    if (eventLoading || registrantsLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }
    if (error) {
        return <Alert message="Error" description="Could not load event data." type="error" showIcon />;
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <Row gutter={[32, 32]} style={{ padding: '40px' }}>
                <Col xs={24} md={14}>
                    <Title level={2}>{event.title}</Title>
                    <Paragraph>{new Date(event.date?.seconds * 1000).toLocaleDateString('en-GB', { /* ... */ })}</Paragraph>
                    <Divider />

                    <Card title="Admin Database Tools" style={{ margin: '40px' }}>
                        <p>
                            Use this tool to generate and upload the complete seat layout for an event.
                            <strong>Warning:</strong> This will overwrite any existing seat data for the event.
                        </p>
                        <Button
                            type="primary"
                            onClick={handleUploadClick}
                        >
                            Generate & Upload Full Seat Layout
                        </Button>
                    </Card>

                    {/* --- Card 1: Registrant Selection --- */}
                    <Card title="1. Select Registrant" style={{ marginBottom: '24px' }}>
                        <Row align="middle" justify="space-between">
                            <Text strong>
                                {watchedFormData.registrant ? `Selected: ${watchedFormData.registrant.name}` : 'No Registrant Selected'}
                            </Text>
                            <Button type="primary" onClick={showModal}>Select Registrant</Button>
                        </Row>
                        <Input
                            placeholder="Registrant email will appear here"
                            value={watchedFormData.registrant?.email || ''}
                            size="large"
                            disabled
                            style={{ marginTop: 16 }}
                        />
                    </Card>

                    {/* --- Card 2: Venue Selection --- */}
                    <Card title="2. Select Venue" style={{ marginBottom: '24px' }}>
                        <Controller
                            name="venue"
                            control={control}
                            rules={{ required: 'Please select a venue' }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Select {...field} showSearch placeholder="Search to Select a Venue" style={{ width: '100%' }} options={venueOptions} status={error ? 'error' : ''} />
                                    {error && <Text type="danger">{error.message}</Text>}
                                </>
                            )}
                        />
                    </Card>

                    {/* --- Card 3: Ticket Selection --- */}
                    <Card title="3. Select Your Tickets" style={{ marginBottom: '24px' }}>
                        {fields.map((field, index) => {
                            const currentQuantity = watchedFormData.tickets[index]?.quantity || 0;
                            return (
                                <div key={field.id} style={{ marginBottom: index === fields.length - 1 ? 0 : '16px' }}>
                                    <Row align="middle" justify="space-between">
                                        <Col><Text>{field.name} (Base Price: ${field.basePrice})</Text></Col>
                                        <Col><Controller name={`tickets.${index}.quantity`} control={control} render={({ field }) => <InputNumber {...field} min={0} max={10} />} /></Col>
                                    </Row>
                                    {currentQuantity > 0 && (
                                        <Row align="middle" justify="space-between" style={{ marginTop: '8px', paddingLeft: '16px' }}>
                                            <Controller name={`tickets.${index}.wantsSeat`} control={control} render={({ field }) => <Checkbox {...field} checked={field.value}>Choose specific seat (add-on)</Checkbox>} />
                                            {watchedFormData.tickets[index]?.wantsSeat && (
                                                <Controller name={`tickets.${index}.seatQuantity`} control={control} render={({ field }) => <InputNumber {...field} min={0} max={currentQuantity} placeholder="Seats" />} />
                                            )}
                                        </Row>
                                    )}
                                </div>
                            );
                        })}
                    </Card>

                    {/* --- Card 4: Date & Session --- */}
                    <Card title="4. Select Date & Session" style={{ marginBottom: '24px' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group {...field} optionType="button" buttonStyle="solid" onChange={(e) => { field.onChange(e); setValue('session', null); }}>
                                        {Object.keys(availableSession).map(date => <Radio.Button key={date} value={date}>{new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</Radio.Button>)}
                                    </Radio.Group>
                                )}
                            />
                            {watchedFormData.date && (
                                <Controller
                                    name="session"
                                    control={control}
                                    render={({ field }) => (
                                        <Radio.Group {...field} optionType="button">
                                            {availableSession[watchedFormData.date].map(session => <Radio.Button key={session} value={session}>{session}</Radio.Button>)}
                                        </Radio.Group>
                                    )}
                                />
                            )}
                        </Space>
                    </Card>

                    {watchedFormData.session && (
                        <Card title={`Live Seat Map for ${watchedFormData.session}`} style={{ marginTop: '24px' }}>
                            {isSeatMapLoading ? (
                                <div style={{ textAlign: 'center' }}><Spin /></div>
                            ) : (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {Object.keys(formattedSessionLayout).map(areaType => {
                                        const layoutForPicker = formattedSessionLayout[areaType] || [];
                                        return (
                                            <div key={areaType}>
                                                <Title level={5} style={{ textTransform: 'capitalize' }}>{areaType} Section</Title>
                                                <div style={{ overflowX: 'auto', padding: '10px', background: '#fafafa', borderRadius: '8px' }}>
                                                    <CustomSeatPicker
                                                        layout={layoutForPicker}
                                                        isReadOnly={true} // Set to read-only mode
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Space>
                            )}
                        </Card>
                    )}

                    {/* --- Card 5: Optional Packages --- */}
                    {/* <Card title="5. Optional Packages" style={{ marginBottom: '24px' }}>
                        <Controller
                            name="addOns"
                            control={control}
                            render={({ field }) => (
                                <Checkbox.Group {...field} style={{ display: 'flex', flexDirection: 'column' }}>
                                    {event.addOns?.map(addOn => (
                                        <Checkbox key={addOn.id} value={addOn.id} style={{ marginBottom: '8px' }}>
                                            {addOn.name} (+${addOn.price})
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            )}
                        />
                    </Card> */}
                </Col>

                {/* --- Order Summary Column --- */}
                <Col xs={24} md={10}>
                    <Card style={{ position: 'sticky', top: '20px' }}>
                        <Title level={4}>Order Summary</Title>
                        <div style={{ marginBottom: '16px' }}>
                            {watchedFormData.registrant && <Paragraph>For: <Text strong>{watchedFormData.registrant.name}</Text></Paragraph>}
                            {watchedFormData.venue && <Paragraph>Venue: <Text strong>{venueOptions.find(v => v.value === watchedFormData.venue)?.label}</Text></Paragraph>}
                            {watchedFormData.date && watchedFormData.session && <Paragraph>When: <Text strong>{new Date(watchedFormData.date).toLocaleDateString('id-ID')} at {watchedFormData.session}</Text></Paragraph>}
                        </div>
                        {orderSummary.items.length > 0 && <Divider style={{ margin: '0 0 16px 0' }} />}
                        <List
                            dataSource={orderSummary.items}
                            renderItem={item => (
                                <List.Item style={{ padding: '8px 0' }}>
                                    <List.Item.Meta title={item.description} description={item.quantity > 1 ? `Quantity: ${item.quantity}` : null} />
                                    <Text>${item.price}</Text>
                                </List.Item>
                            )}
                        />
                        <Divider />
                        <Row justify="space-between">
                            <Col><Title level={3}>Total</Title></Col>
                            <Col><Title level={3}>${orderSummary.total}</Title></Col>
                        </Row>
                        <Button type="primary" size="large" block htmlType="submit">
                            Send Email Link
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* --- Registrant Selection Modal --- */}
            <Modal
                title="Select a Registrant"
                open={isModalOpen}
                onOk={handleModalConfirm}
                onCancel={handleCloseModal}
                width={1000}
                okText="Select"
                okButtonProps={{ disabled: !tempSelectedRow }}
            >
                <Input.Search placeholder="Search by performer name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: 16 }} allowClear />
                <Table
                    rowSelection={{ type: 'radio', onChange: (_, selectedRows) => setTempSelectedRow(selectedRows[0]) }}
                    columns={[
                        { title: 'Performer', key: 'performer', render: (_, rec) => `${rec?.performers[0]?.firstName} ${rec?.performers[0]?.lastName}` },
                        { title: 'Email', key: 'email', render: (_, rec) => rec?.performers[0]?.email },
                        { title: 'Instrument Category', key: 'instrumentCategory', render: (_, rec) => rec?.instrumentCategory },
                    ]}
                    dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>

            <Modal
                title={`Assign a Registrant to Seat ${seatToAssign?.seatLabel || ''}`}
                open={isAssignModalOpen}
                onOk={handleAssignModalConfirm}
                onCancel={handleAssignModalCancel}
                width={1000}
                okText="Assign Seat"
                okButtonProps={{ disabled: !registrantToAssign }}
            >
                <Input.Search placeholder="Search by performer name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: 16 }} allowClear />
                <Table
                    rowSelection={{ type: 'radio', onChange: (_, selectedRows) => setRegistrantToAssign(selectedRows[0]) }}
                    columns={[
                        { title: 'Performer', key: 'performer', render: (_, rec) => `${rec?.performers[0]?.firstName} ${rec?.performers[0]?.lastName}` },
                        { title: 'Email', key: 'email', render: (_, rec) => rec?.performers[0]?.email },
                        { title: 'Instrument Category', key: 'instrumentCategory', render: (_, rec) => rec?.instrumentCategory },
                    ]}
                    dataSource={registrantDatas.map(item => ({ ...item, key: item.id }))}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </form>
    );
};

export default SeatingEvent;