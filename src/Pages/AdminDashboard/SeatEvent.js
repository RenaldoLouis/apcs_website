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
import { doc, writeBatch } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import apis from '../../apis';
import { db } from '../../firebase';
import { useEventBookingData } from '../../hooks/useEventBookingData';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Title, Text, Paragraph } = Typography;

// --- Component Constants ---
const venueOptions = [
    { value: 'Venue1', label: 'Venue 1' },
    { value: 'Venue2', label: 'Venue 2 ' }
];

const availableSessions = {
    '2025-08-25': ['09:00-10:00', '11:00-12:00', '14:00-15:00'],
    '2025-08-26': ['10:00-11:00', '13:00-14:00'],
    '2025-08-27': ['09:00-10:00', '11:00-12:00', '15:00-16:00'],
};

const EVENT_SESSIONS = [
    "2025-08-25_09:00-10:00",
    "2025-08-25_11:00-12:00",
    "2025-08-25_14:00-15:00",
    "2025-08-26_10:00-11:00",
    "2025-08-26_13:00-14:00",
];

/**
 * Generates a flat array of seat objects for a single section's layout.
 * @returns {Array<object>} An array of seat "template" objects.
 */
const generateSeatLayoutTemplates = () => {
    // Defines the physical layout of the venue
    const generateSection = (areaType, numRows, seatsPerRow, startRowChar) => {
        const seats = [];
        const startCharCode = startRowChar.charCodeAt(0);
        for (let i = 0; i < numRows; i++) {
            const rowChar = String.fromCharCode(startCharCode + i);
            for (let j = 1; j <= seatsPerRow; j++) {
                seats.push({
                    seatLabel: `${rowChar}${j}`,
                    areaType: areaType,
                    row: rowChar,
                    number: j,
                });
            }
        }
        return seats;
    };

    const lentoSeats = generateSection('lento', 5, 20, 'A');
    const allegroSeats = generateSection('allegro', 8, 20, 'F');
    const prestoSeats = generateSection('presto', 8, 20, 'N');

    return [...lentoSeats, ...allegroSeats, ...prestoSeats];
};

/**
 * Generates and uploads the full seat availability for all sessions of an event.
 * WARNING: This will CREATE OR OVERWRITE all seat data for the specified event and sessions.
 * @param {string} eventId - The ID of the event.
 * @param {Array<string>} sessions - An array of session identifiers (e.g., "2025-08-25_09:00-10:00").
 */
export const uploadFullSeatLayout = async (eventId, sessions) => {
    console.log(`Starting to generate seat availability for event: ${eventId}`);
    if (!sessions || sessions.length === 0) {
        console.error("No sessions provided.");
        alert("Error: No sessions provided to generate seats for.");
        return;
    }

    try {
        // 1. Get the physical layout of the venue
        const seatTemplates = generateSeatLayoutTemplates();
        const allSeatInstances = [];

        // 2. Create a unique document for EACH seat in EACH session
        for (const sessionId of sessions) {
            for (const seatTemplate of seatTemplates) {
                const documentId = `${seatTemplate.areaType}-${seatTemplate.seatLabel}_${eventId}_${sessionId}`;

                allSeatInstances.push({
                    id: documentId, // For the batch operation
                    eventId: eventId,
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
        alert("Seat layout and availability for all sessions uploaded successfully!");

    } catch (error) {
        console.error("❌ Error uploading seat layout:", error);
        alert(`An error occurred: ${error.message}`);
    }
};

const SeatingEvent = () => {
    const eventId = "APCS2025";

    // --- Data Fetching Hooks ---
    const { registrantDatas, loading: registrantsLoading } = usePaginatedRegistrants(9999, "Registrants2025", "createdAt");
    const { event, loading: eventLoading, error } = useEventBookingData(eventId);

    // --- UI State (for modal, search, etc.) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedRow, setTempSelectedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleUploadClick = async () => {
        // setIsLoading(true);
        message.info('Starting full seat layout upload for all sessions. This may take a moment...');

        await uploadFullSeatLayout('APCS2025', EVENT_SESSIONS);

        // setIsLoading(false);
    };

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
                                        {Object.keys(availableSessions).map(date => <Radio.Button key={date} value={date}>{new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</Radio.Button>)}
                                    </Radio.Group>
                                )}
                            />
                            {watchedFormData.date && (
                                <Controller
                                    name="session"
                                    control={control}
                                    render={({ field }) => (
                                        <Radio.Group {...field} optionType="button">
                                            {availableSessions[watchedFormData.date].map(session => <Radio.Button key={session} value={session}>{session}</Radio.Button>)}
                                        </Radio.Group>
                                    )}
                                />
                            )}
                        </Space>
                    </Card>

                    {/* --- Card 5: Optional Packages --- */}
                    <Card title="5. Optional Packages" style={{ marginBottom: '24px' }}>
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
                    </Card>
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
                            Continue to Payment
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
                    columns={[{ title: 'Performer', key: 'performer', render: (_, rec) => `${rec.performers[0].firstName} ${rec.performers[0].lastName}` }, { title: 'Email', key: 'email', render: (_, rec) => rec.performers[0].email }]}
                    dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </form>
    );
};

export default SeatingEvent;