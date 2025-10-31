import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
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
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { collection, doc, getDocs, query, runTransaction, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import apis from '../../apis';
import { db } from '../../firebase';
import { useEventBookingData } from '../../hooks/useEventBookingData';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';
import useFetchSeatBookData from '../../hooks/useFetchSeatBookData';
import CustomSeatPickerGeneral from '../SelectSeat/CustomSeatPickerGeneral';

const { Title, Text, Paragraph } = Typography;

// --- Component Constants ---
const venueOptions = [
    { value: 'Venue1', label: 'Jatayu' },
    { value: 'Venue2', label: 'Melati' }
];

const availableSessionsVenue1 = {
    '2025-11-01': ['10:00-12:25', '14:40-17:00', '18:50-20:40'],
    '2025-11-02': ['10:05-12:15', '14:10-16:30', '18:40-20:50'],
};

const availableSessionsVenue2 = {
    '2025-11-01': ['10:20-12:20', '14:10-16:00', '18:05-20:15'],
    '2025-11-02': ['10:25-12:45', '14:40-16:50', '18:35-20:35'],
};

const GeneralSeat = () => {
    const eventId = "APCS2025";

    // --- Data Fetching Hooks ---
    const { registrantDatas, loading: registrantsLoading } = usePaginatedRegistrants(9999, "Registrants2025", "createdAt");
    const { event, setLoading, loading: eventLoading, error } = useEventBookingData(eventId);

    // --- NEW STATE for the assignment process ---
    const [seatToAssign, setSeatToAssign] = useState(null); // Stores the seat that was clicked
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Controls the registrant modal
    const [registrantToAssign, setRegistrantToAssign] = useState(null); // Stores the registrant selected in the modal
    const [manualAssignName, setManualAssignName] = useState('');        // For "Manual" mode
    const [manualAssignEmail, setManualAssignEmail] = useState('');       // For "Manual" mode
    const [assignmentMode, setAssignmentMode] = useState('select');
    const [extraSeats, setExtraSeats] = useState([]);

    // --- UI State (for modal, search, etc.) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isrefetchSeatMap, setIsrefetchSeatMap] = useState(false);
    const [tempSelectedRow, setTempSelectedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalSearchTerm, setModalSearchTerm] = useState('');

    const [seatLayout, setSeatLayout] = useState([]); // This will hold the single, flat list from the backend
    const [isSeatMapLoading, setIsSeatMapLoading] = useState(false);
    const {
        userBookData: seatBookings,
        loading: bookingsLoading,
        error: bookingsError
    } = useFetchSeatBookData("seatBook2025");

    const [isExporting, setIsExporting] = useState(false);
    const [isExportingStatus, setIsExportingStatus] = useState(false);

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

    const filteredModalData = useMemo(() => {
        if (!registrantDatas) return []; // Start with the full list of registrants

        // If the modal search bar is empty, show the full list
        if (!modalSearchTerm) return registrantDatas;

        const lowercasedFilter = modalSearchTerm.toLowerCase();

        // Filter the full list based on the modal's search term
        return registrantDatas.filter(registrant => {
            const performer = registrant.performers?.[0];
            if (!performer) return false;
            const fullName = `${performer.firstName} ${performer.lastName}`.toLowerCase();
            return fullName.includes(lowercasedFilter);
        });
    }, [registrantDatas, modalSearchTerm]);

    // This memo finds bookings assigned by an admin (ready to be emailed)
    const adminAssignedBookings = useMemo(() => {
        if (!seatBookings || !watchedFormData.session) return [];
        return seatBookings.filter(b =>
            !b.seatsSelected &&
            !b.isEmailSent &&
            b.venue === watchedFormData.venue &&
            b.session === watchedFormData.session
        );
    }, [seatBookings, watchedFormData.venue, watchedFormData.session]);

    // This memo finds bookings completed by the user
    const userAssignedBookings = useMemo(() => {
        if (!seatBookings || !watchedFormData.session) return [];
        return seatBookings.filter(b =>
            b.seatsSelected === true &&
            b.isEmailSent === true &&
            b.venue === watchedFormData.venue &&
            b.session === watchedFormData.session
        );
    }, [seatBookings, watchedFormData.venue, watchedFormData.session]);

    const handleExportBookingStatus = () => {
        if (adminAssignedBookings.length === 0 && userAssignedBookings.length === 0) {
            message.warn("No booking data to export.");
            return;
        }

        setIsExportingStatus(true);
        message.info("Preparing booking status report...");

        try {
            const workbook = new ExcelJS.Workbook();

            // Helper function to extract and format seat labels
            const formatSeats = (selectedSeats) => {
                if (!selectedSeats || selectedSeats.length === 0) return 'N/A';
                return selectedSeats.map(s => s.split('_')[0].split('-').slice(1).join('-')).join(', ');
            };

            // Helper function to add a sheet to the workbook
            const addSheet = (sheetName, data) => {
                const worksheet = workbook.addWorksheet(sheetName);

                // Define Headers
                worksheet.getRow(1).values = ['User Name', 'User Email', 'Venue', 'Session', 'Selected Seats'];
                worksheet.getRow(1).font = { bold: true };

                // Map data to rows
                const dataForSheet = data.map(item => ({
                    'User Name': item.userName,
                    'User Email': item.userEmail,
                    'Venue': item.venue === "Venue1" ? "Jatayu" : "Melati",
                    'Session': item.session,
                    'Selected Seats': formatSeats(item.selectedSeats)
                }));

                dataForSheet.forEach(item => {
                    worksheet.addRow(Object.values(item));
                });

                // Auto-fit columns
                worksheet.columns.forEach(column => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, (cell) => {
                        const len = cell.value ? cell.value.toString().length : 10;
                        if (len > maxLength) maxLength = len;
                    });
                    column.width = maxLength + 2;
                });
            };

            // Create both sheets
            addSheet('Need to Send', adminAssignedBookings);
            addSheet('Email Sent', userAssignedBookings);

            // Generate and download the file
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const fileName = `BookingStatus_${watchedFormData.venue}_${watchedFormData.date}_${watchedFormData.session}.xlsx`;
                FileSaver.saveAs(blob, fileName);
            });

        } catch (error) {
            console.error("Failed to export booking status:", error);
            message.error("An error occurred during the export.");
        } finally {
            setIsExportingStatus(false);
        }
    };

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
    }, [watchedFormData.venue, watchedFormData.date, watchedFormData.session, isrefetchSeatMap]);

    const runGeneralSeatingCampaign = async () => {
        console.log("Starting general seating email campaign...");
        message.loading("Starting general seating email campaign...")

        try {
            // 1. Fetch all documents from 'seatBook2025' that have NOT had an email sent yet.
            const q = query(
                collection(db, "seatBook2025"),
                where("isEmailSent", "!=", true),
                where("isGeneralTicket", "==", true)
            );
            const querySnapshot = await getDocs(q);

            const bookingsToSend = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (bookingsToSend.length === 0) {
                message.success("No new bookings found that need a general seating email. Exiting.")
                console.log("No new bookings found that need a general seating email. Exiting.");
                return;
            }

            console.log(`Found ${bookingsToSend.length} length bookings to process.`);

            let successCount = 0;
            const batch = writeBatch(db); // Create a batch to update documents in Firestore

            // // 2. Loop through each booking, send the email, and update the document
            for (const booking of bookingsToSend) {
                const emailSent = await apis.email.sendGeneralSeatingEmail(booking);
                console.log('Found booking data to process:', booking);

                // If the email was sent successfully, mark it in Firestore
                if (emailSent.status === 200) {
                    successCount++;
                    const docRef = doc(db, "seatBook2025", booking.id);
                    batch.update(docRef, { isEmailSent: true });
                } else {
                    throw new Error(`Send Email Failed.`);
                }

                // Add a small delay to avoid overwhelming the email server
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 3. Commit all the Firestore updates at once
            await batch.commit();


            message.success(`🎉 Campaign finished! Successfully sent ${successCount} emails.`)

        } catch (error) {
            console.error("An error occurred during the campaign:", error);
        }
    };

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
                        seatLabel: seat.seatLabel,
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

    const handleUnassignSeat = async (seatToRelease) => {
        console.log("seatToRelease", seatToRelease)
        message.loading({ content: `Releasing seat ${seatToRelease.seatLabel}...`, key: 'unassign' });

        try {
            await runTransaction(db, async (transaction) => {
                // 1. Get the seat document
                const seatDocRef = doc(db, `seats${eventId}`, seatToRelease.id);
                const seatDoc = await transaction.get(seatDocRef);

                if (!seatDoc.exists()) {
                    throw new Error("Seat document not found.");
                }

                const seatData = seatDoc.data();
                const bookingId = seatData.bookingId; // Get the booking ID from the seat

                console.log("seatData", seatData)


                // 3. Update the corresponding Booking Document (if a bookingId exists)
                if (bookingId) {
                    const bookingDocRef = doc(db, "seatBook2025", bookingId);
                    const bookingDoc = await transaction.get(bookingDocRef);

                    transaction.update(seatDocRef, {
                        status: 'available',
                        assignedTo: null,
                        bookingId: null
                    });

                    if (bookingDoc.exists()) {
                        const bookingData = bookingDoc.data();

                        console.log("bookingData", bookingData)

                        // Remove the seat from the selectedSeats array
                        const updatedSelectedSeats = (bookingData.selectedSeats || []).filter(
                            id => id !== seatToRelease.id
                        );

                        console.log("updatedSelectedSeats", updatedSelectedSeats)

                        transaction.update(bookingDocRef, {
                            selectedSeats: updatedSelectedSeats,
                            // If this was the last seat, mark it as no longer selected
                            seatsSelected: updatedSelectedSeats.length > 0,
                            // TODO: this emailsent might need to modify based on specific needs when unassign seat
                            isEmailSent: true // Mark for re-processing in the email campaign
                        });
                    }
                }
            });

            message.success({ content: `Seat ${seatToRelease.seatLabel} has been released.`, key: 'unassign' });

            setIsrefetchSeatMap(!isrefetchSeatMap);

        } catch (error) {
            console.error("Failed to un-assign seat:", error);
            message.error({ content: error.message || 'Failed to release seat.', key: 'unassign' });
        }
    };

    // --- NEW HANDLERS for the assignment flow ---
    const handleSeatClick = (seat) => {
        console.log("seat", seat)
        if (seat.status === 'available') {
            // This is the "Assign Seat" flow
            message.info(`Seat ${seat.seatLabel} is available. Select a registrant to assign.`);
            setSeatToAssign(seat);
            setIsAssignModalOpen(true);
        } else {
            // --- THIS IS THE NEW "UN-ASSIGN" FLOW ---
            // The seat is already reserved, so we ask for confirmation to release it.
            Modal.confirm({
                title: `Release Seat ${seat.seatLabel}?`,
                content: `This seat is currently reserved for ${seat.tooltip}. Are you sure you want to release it? This will remove the seat from their booking and make it available again.`,
                okText: 'Yes, Release Seat',
                okType: 'danger',
                onOk: () => handleUnassignSeat(seat), // Call the new handler function
            });
        }
    };

    const handleAssignModalCancel = () => {
        setIsAssignModalOpen(false);
        setSeatToAssign(null);
        setRegistrantToAssign(null);
        setAssignmentMode('select'); // Reset mode
        setManualAssignName('');
        setManualAssignEmail('');
        setExtraSeats([]); // <-- ADD THIS LINE
    };

    const handleExportSeatMap = () => {
        if (Object.keys(formattedSessionLayout).length === 0) {
            message.warn("No seat map data available to export.");
            return;
        }

        setIsExporting(true);
        message.info("Preparing visual seat map for download...");

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Seat Map Layout');

            // --- 1. Define Styles for Cells ---
            const availableStyle = {
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } }, // Light Green
                font: { color: { argb: 'FF006100' } },
                alignment: { vertical: 'middle', horizontal: 'center' },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };
            const reservedStyle = {
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }, // Light Red
                font: { color: { argb: 'FF9C0006' }, bold: true },
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
                border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            };

            let currentRowIndex = 1; // Start at the first row in Excel
            const areaOrder = ['presto', 'allegro', 'lento'];

            // --- 2. Loop Through Each Section (Presto, Allegro, Lento) ---
            areaOrder.forEach(area => {
                if (formattedSessionLayout[area]) {
                    // Add a styled title for the section
                    const sectionTitleCell = worksheet.getCell(currentRowIndex, 1);
                    sectionTitleCell.value = `${area.charAt(0).toUpperCase() + area.slice(1)} Section`;
                    sectionTitleCell.font = { size: 16, bold: true };
                    worksheet.mergeCells(currentRowIndex, 1, currentRowIndex, 10); // Merge cells for the title
                    currentRowIndex += 2; // Move down a couple of rows for spacing

                    // --- 3. Loop Through Each Row of Seats (A, B, C...) ---
                    formattedSessionLayout[area].forEach(seatRow => {
                        if (seatRow.length > 0) {
                            // Add the row letter (e.g., 'A') to the first column
                            const rowLabelCell = worksheet.getCell(currentRowIndex, 1);
                            rowLabelCell.value = seatRow[0].row;
                            rowLabelCell.font = { bold: true };
                            rowLabelCell.alignment = { vertical: 'middle', horizontal: 'center' };

                            const maxNumber = Math.max(...seatRow.map(s => s.number));

                            // --- 4. Place each seat in its corresponding column ---
                            seatRow.forEach(seat => {
                                // Column index is seat number + 1 (because column 1 is the row label)
                                const columnIndex = maxNumber - seat.number + 2; // +2 because col 1 is the label
                                const cell = worksheet.getCell(currentRowIndex, columnIndex);

                                if (seat.isReserved) {
                                    let assignedTo = 'Reserved';
                                    if (seat.tooltip.startsWith('Reserved for: ')) {
                                        assignedTo = seat.tooltip.substring('Reserved for: '.length);
                                    }
                                    cell.value = assignedTo;
                                    cell.style = reservedStyle;
                                } else {
                                    cell.value = seat.number; // Just show the number for available seats
                                    cell.style = availableStyle;
                                }
                            });
                            currentRowIndex++; // Move to the next row in Excel for the next seat row
                        }
                    });
                    currentRowIndex += 2; // Add extra space between sections
                }
            });

            // Auto-fit columns for better readability
            worksheet.columns.forEach(column => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    // Don't use merged title rows for width calculation
                    if (rowNumber > 1) {
                        const columnLength = cell.value ? cell.value.toString().length : 0;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    }
                });
                column.width = maxLength < 5 ? 5 : maxLength + 2;
            });


            // --- 5. Generate and Download the File ---
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const fileName = `SeatMap_Layout_${watchedFormData.venue}_${watchedFormData.date}_${watchedFormData.session}.xlsx`;
                FileSaver.saveAs(blob, fileName);
            });

        } catch (error) {
            console.error("Failed to export seat map:", error);
            message.error("An error occurred during the export.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleAssignModalConfirm = async () => {
        // 1. Validate inputs based on the current mode
        if (assignmentMode === 'select' && !registrantToAssign) {
            message.error("Please select a registrant from the list.");
            return;
        }
        if (assignmentMode === 'manual' && (!manualAssignName || !manualAssignEmail)) {
            message.error("Please provide a name and email for manual assignment.");
            return;
        }

        // --- NEW: Combine the clicked seat + any extra seats ---
        const allSeatsToAssign = [seatToAssign, ...extraSeats];

        message.loading({ content: 'Assigning seats...', key: 'assignSeat' });
        try {
            await runTransaction(db, async (transaction) => {
                // --- 1. Check Seat Availability (Same for both modes) ---
                for (const seat of allSeatsToAssign) {
                    const seatDocRef = doc(db, `seats${eventId}`, seat.id);
                    const seatDoc = await transaction.get(seatDocRef);
                    if (!seatDoc.exists() || seatDoc.data().status !== 'available') {
                        throw new Error(`Sorry, seat ${seat.seatLabel} is no longer available.`);
                    }
                }
                let bookingId;
                let assignedToData;
                const venue = watchedFormData.venue;

                // --- 2. Run logic based on Assignment Mode ---
                if (assignmentMode === 'select') {
                    // --- UPDATE/CREATE PATH (for existing registrants) ---
                    const performer = registrantToAssign.performers[0];
                    assignedToData = {
                        registrantId: registrantToAssign.id,
                        registrantName: `${performer.firstName} ${performer.lastName}`,
                        registrantEmail: performer.email
                    };

                    const bookingQuery = query(
                        collection(db, "seatBook2025"),
                        where("userId", "==", registrantToAssign.id),
                        where("venue", "==", watchedFormData.venue),
                        where("session", "==", watchedFormData.session),
                        where("isEmailSent", "!=", true),

                    );
                    const bookingQuerySnap = await getDocs(bookingQuery);

                    if (!bookingQuerySnap.empty) {
                        // Update existing booking
                        const bookingDocRef = bookingQuerySnap.docs[0].ref;
                        const bookingData = bookingQuerySnap.docs[0].data();
                        bookingId = bookingDocRef.id;

                        // --- NEW: Add ALL new seats to the array ---
                        const newSeatIds = allSeatsToAssign.map(s => s.id);
                        const updatedSelectedSeats = [...(bookingData.selectedSeats || []), ...newSeatIds];

                        transaction.update(bookingDocRef, {
                            seatsSelected: true,
                            selectedSeats: updatedSelectedSeats,
                            isEmailSent: false,
                            isGeneralTicket: true,
                        });
                    } else {
                        // Create new booking for the selected registrant
                        const newBookingDocRef = doc(collection(db, "seatBook2025"));
                        bookingId = newBookingDocRef.id;
                        const newBookingData = {
                            eventId,
                            userId: registrantToAssign.id,
                            userName: assignedToData.registrantName,
                            userEmail: assignedToData.registrantEmail,
                            venue: venue,
                            date: watchedFormData.date,
                            session: watchedFormData.session,
                            createdAt: serverTimestamp(),
                            seatsSelected: true,
                            selectedSeats: allSeatsToAssign.map(s => s.id), // <-- Add all seats
                            isEmailSent: false,
                            isGeneralTicket: true,
                            tickets: [], // Add ticket logic here if needed
                            addOns: [],
                        };
                        transaction.set(newBookingDocRef, newBookingData);
                    }
                } else {
                    // --- MANUAL UPDATE/CREATE PATH (for new guests) ---
                    assignedToData = {
                        registrantId: 'MANUAL_ASSIGN',
                        registrantName: manualAssignName,
                        registrantEmail: manualAssignEmail
                    };

                    // --- THIS IS THE FIX ---
                    // Query for an existing manual booking for this email and session
                    const manualBookingQuery = query(
                        collection(db, "seatBook2025"),
                        where("userEmail", "==", manualAssignEmail), // Use email as the identifier
                        where("userName", "==", manualAssignName), // Use email as the identifier
                        where("venue", "==", venue),
                        where("session", "==", watchedFormData.session)
                    );
                    const manualBookingSnap = await getDocs(manualBookingQuery);

                    if (!manualBookingSnap.empty) {
                        // --- UPDATE PATH (Manual User) ---
                        const bookingDocRef = manualBookingSnap.docs[0].ref;
                        const bookingData = manualBookingSnap.docs[0].data();
                        bookingId = bookingDocRef.id;

                        // --- NEW: Add ALL new seats to the array ---
                        const newSeatIds = allSeatsToAssign.map(s => s.id);
                        const updatedSelectedSeats = [...(bookingData.selectedSeats || []), ...newSeatIds];

                        transaction.update(bookingDocRef, {
                            seatsSelected: true,
                            selectedSeats: updatedSelectedSeats,
                            isEmailSent: false, // Ensure it gets picked up by the email campaign
                            isGeneralTicket: true,
                        });
                    } else {
                        // --- CREATE PATH (Manual User) ---
                        console.log("No existing manual booking found, creating new one...");
                        const newBookingDocRef = doc(collection(db, "seatBook2025"));
                        bookingId = newBookingDocRef.id;

                        const newBookingData = {
                            eventId,
                            userId: 'MANUAL_ASSIGN',
                            userName: manualAssignName,
                            userEmail: manualAssignEmail,
                            venue: venue,
                            date: watchedFormData.date,
                            session: watchedFormData.session,
                            createdAt: serverTimestamp(),
                            seatsSelected: true,
                            selectedSeats: allSeatsToAssign.map(s => s.id), // <-- Add all seats
                            isEmailSent: false,
                            isGeneralTicket: true,
                            tickets: [],
                            addOns: [],
                        };
                        transaction.set(newBookingDocRef, newBookingData);
                    }
                }

                // --- 3. Update the Seat Document (Common step) ---
                for (const seat of allSeatsToAssign) {
                    const seatDocRef = doc(db, `seats${eventId}`, seat.id);
                    transaction.update(seatDocRef, {
                        status: 'reserved',
                        bookingId: bookingId,
                        assignedTo: assignedToData
                    });
                }
            });

            message.success({ content: `Successfully assigned ${allSeatsToAssign.length} seats!`, key: 'assignSeat' });
            handleAssignModalCancel();
            setIsrefetchSeatMap(!isrefetchSeatMap);
        } catch (error) {
            console.error("Failed to assign seat:", error);
            message.error({ content: error.message || 'Failed to assign seat.', key: 'assignSeat' });
        }
    };

    const availableSeatsForModal = useMemo(() => {
        if (!seatToAssign || Object.keys(formattedSessionLayout).length === 0) return [];

        const area = seatToAssign.id.split('-')[0];
        if (!formattedSessionLayout[area]) return [];

        // Flatten the array of rows to a single list of seat objects
        const allSeatsInArea = formattedSessionLayout[area].flat(2);

        return allSeatsInArea
            .filter(Boolean) // <-- 1. ADD THIS: Removes any null/undefined seats
            .filter(seat => seat.status === 'available' && seat.id !== seatToAssign.id)
            .map(seat => ({
                label: `Seat ${seat.seatLabel}`,
                value: seat.id,
                seatObject: seat
            }));
    }, [seatToAssign, formattedSessionLayout]);

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
        <form>
            <Row style={{ padding: '40px' }}>
                <Col xs={24} md={24}>
                    <Title level={2}>{event.title}</Title>
                    <Paragraph>{new Date(event.date?.seconds * 1000).toLocaleDateString('en-GB', { /* ... */ })}</Paragraph>
                    <Divider />

                    <Card title="Admin Database Tools" style={{ margin: '40px' }}>
                        {/* <WinnerEmailSender /> */}
                        {/* <SessionEmailSender /> */}
                        <Button type="primary" onClick={runGeneralSeatingCampaign}>Send Email General</Button>
                    </Card>

                    {/* --- Card 1: Registrant Selection --- */}
                    {/* <Card title="1. Select Registrant" style={{ marginBottom: '24px' }}>
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
                    </Card> */}

                    {/* --- Card 2: Venue Selection --- */}
                    <Card title="1. Select Venue" style={{ marginBottom: '24px' }}>
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

                    {/* --- Card 4: Date & Session --- */}
                    <Card title="2. Select Date & Session" style={{ marginBottom: '24px' }}>
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
                        <Card title="Booking Status Summary" style={{ marginTop: '24px' }}
                            extra={
                                <Button
                                    type="primary"
                                    onClick={handleExportBookingStatus}
                                    loading={isExportingStatus}
                                >
                                    Export Status List
                                </Button>
                            }
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Title level={5}>Need to Send General Seat Email</Title>
                                    <List
                                        bordered
                                        dataSource={adminAssignedBookings}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.userName}
                                                    description={`Seats: ${(item.selectedSeats || []).map(s => s.split('_')[0].split('-')[1]).join(', ')}`}
                                                />
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: 'No bookings to email' }}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <Title level={5}>User-Completed (Email Already Sent)</Title>
                                    <List
                                        bordered
                                        dataSource={userAssignedBookings}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.userName}
                                                    description={`Seats: ${(item.selectedSeats || []).map(s => s.split('_')[0].split('-')[1]).join(', ')}`}
                                                />
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: 'No completed bookings' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    )}

                    {/* --- NEW CARD: Interactive Seat Map for Assignment --- */}
                    {watchedFormData.session && (
                        <Card title="Assign Registrant to Seat" style={{ marginTop: '24px' }}
                            extra={
                                <Button
                                    type="primary"
                                    onClick={handleExportSeatMap}
                                    loading={isExporting}
                                >
                                    Export Seat Map
                                </Button>
                            }
                        >
                            {isSeatMapLoading ? (
                                <div style={{ textAlign: 'center' }}><Spin /></div>
                            ) : (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {Object.keys(formattedSessionLayout).map(areaType => (
                                        <div key={areaType}>
                                            <Title level={5} style={{ textTransform: 'capitalize' }}>{areaType} Section</Title>
                                            <div style={{ overflowX: 'auto', padding: '10px', background: '#fafafa', borderRadius: '8px' }}>
                                                <CustomSeatPickerGeneral
                                                    layout={formattedSessionLayout[areaType] || []}
                                                    onSeatClick={handleSeatClick} // Pass the new handler
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Space>
                            )}
                        </Card>
                    )}
                </Col>
            </Row>


            <Modal
                title={`Assign a Registrant to Seat ${seatToAssign?.seatLabel || ''}`}
                open={isAssignModalOpen}
                onOk={handleAssignModalConfirm}
                onCancel={handleAssignModalCancel}
                width={1000}
                okText="Assign Seat"
                okButtonProps={{
                    disabled: (assignmentMode === 'select' && !registrantToAssign) ||
                        (assignmentMode === 'manual' && (!manualAssignName || !manualAssignEmail))
                }}
            >
                <Radio.Group
                    onChange={(e) => setAssignmentMode(e.target.value)}
                    value={assignmentMode}
                    style={{ marginBottom: 16 }}
                >
                    <Radio.Button value="select">Select from List</Radio.Button>
                    <Radio.Button value="manual">Enter Manually</Radio.Button>
                </Radio.Group>

                <Divider />

                {/* --- NEW MULTI-SELECT DROPDOWN --- */}
                <Form layout="vertical">
                    <Form.Item label={`Assign additional seats in this section (You are already assigning ${seatToAssign?.seatLabel}):`}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select other seats to assign to this person..."
                            options={availableSeatsForModal}
                            // When an option is selected, we get the value (the ID)
                            // We need to find the full seat object to add to our state
                            onChange={(selectedIds) => {
                                // --- THIS IS THE FIX ---
                                const seats = selectedIds
                                    .map(id => availableSeatsForModal.find(opt => opt.value === id)?.seatObject)
                                    .filter(Boolean); // <-- 2. ADD THIS: Filters out any 'undefined' results

                                setExtraSeats(seats);
                                // --- END OF FIX ---
                            }}
                        />
                    </Form.Item>
                </Form>
                {/* --- END OF NEW DROPDOWN --- */}

                {assignmentMode === 'select' && (
                    <>
                        <Input.Search
                            placeholder="Search by performer name..."
                            // --- UPDATE THIS ---
                            value={modalSearchTerm}
                            onChange={(e) => setModalSearchTerm(e.target.value)}
                            // --- END OF UPDATE ---
                            style={{ marginBottom: 16 }}
                            allowClear
                        />
                        <Table
                            rowSelection={{
                                type: 'radio',
                                onChange: (_, selectedRows) => setRegistrantToAssign(selectedRows[0]),
                            }}
                            columns={[
                                { title: 'Performer', key: 'performer', render: (_, rec) => `${rec?.performers[0]?.firstName} ${rec?.performers[0]?.lastName}` },
                                { title: 'Email', key: 'email', render: (_, rec) => rec?.performers[0]?.email },
                                { title: 'Instrument Category', key: 'instrumentCategory', render: (_, rec) => rec?.instrumentCategory },
                            ]}                            // --- UPDATE THIS ---
                            dataSource={filteredModalData.map(item => ({ ...item, key: item.id }))}
                            // --- END OF UPDATE ---
                            pagination={{ pageSize: 5 }}
                        />
                    </>
                )}

                {/* --- Conditional: Manual Input Mode --- */}
                {assignmentMode === 'manual' && (
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Registrant Name" required>
                                    <Input
                                        placeholder="e.g., John Doe"
                                        value={manualAssignName}
                                        onChange={(e) => setManualAssignName(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Registrant Email" required>
                                    <Input
                                        placeholder="e.g., john.doe@example.com"
                                        value={manualAssignEmail}
                                        onChange={(e) => setManualAssignEmail(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>
        </form>
    );
};

export default GeneralSeat;