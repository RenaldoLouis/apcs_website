import { Button, Layout, message, Pagination, Table, theme } from 'antd';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import JSZip from "jszip";
import * as xlsx from 'xlsx';
import apis from '../../apis';
import { getRegistrants2025Columns } from '../../constant/RegistrantsColumn';
import { db } from '../../firebase';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

import { collection, getDocs, writeBatch } from "firebase/firestore";
import { useState } from 'react';
import { extractVideoId, fetchYouTubeDuration } from '../../utils/youtube';
// Import the new utility functions
import { Form, Input, Modal, Progress } from 'antd';
import { parseDateString } from '../../utils/Utils';

// ...other imports
const { Content } = Layout;

const RegistrantDashboard = () => {
    const pageSize = 10

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const [isUploading, setIsUploading] = useState(false);

    // --- NEW STATE FOR THE EDIT MODAL ---
    const [editFormState, setEditFormState] = useState({
        firstName: '',
        lastName: '',
        youtubeLink: '',
        email: "",
    });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // 1. Add state to hold the current search term
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Pass the searchTerm to your updated hook
    const {
        allData,
        registrantDatas,
        loading,
        error,
        page,
        setPage,
        totalPages,
        totalDocs,
        fetchData: fetchUserData,
    } = usePaginatedRegistrants(pageSize, "Registrants2025", "createdAt", searchTerm);

    // --- State for the new update process ---
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [updateMessage, setUpdateMessage] = useState('');

    const handlePageChange = (pagination, filters, sorter, extra) => {
        setPage(pagination);
    };

    const stripS3Prefix = (uri) => {
        const parts = uri.split('/');
        // Remove 's3:', '', 'bucket-name'
        return parts.slice(3).join('/');
    };


    async function createAndDownloadZip(pdfBlobs) {
        console.log("pdfBlobs", pdfBlobs)
        const zip = new JSZip();

        for (let i = 0; i < pdfBlobs.length; i++) {
            const blob = pdfBlobs[i];
            let currentData = registrantDatas[i]
            zip.file(`${currentData.name}-${i}.pdf`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "registrant.zip");
    }

    const handleDeleteRegistrant = async (recordId) => {
        setDeletingId(recordId);
        try {
            // 1. Create a reference to the document to be deleted
            const docRef = doc(db, 'Registrants2025', recordId);

            // 2. Call Firestore's deleteDoc function
            await deleteDoc(docRef);

            message.success('Registrant deleted successfully!');

            // 3. Refresh the table data. It's often best to go back to page 1.
            if (page !== 1) setPage(1);
            fetchUserData(1);

        } catch (error) {
            console.error("Error deleting registrant: ", error);
            message.error('Failed to delete registrant.');
        } finally {
            setDeletingId(null); // Clear the loading state
        }
    };

    // 1. ADD THESE HELPER FUNCTIONS
    // This function takes an S3 URI like "s3://bucket/key..." and returns just the object key.
    const getS3KeyFromUri = (uri) => {
        if (!uri) return '';
        // This splits the string by slashes and takes everything after the 3rd slash.
        return uri.split('/').slice(3).join('/');
    };

    // This function takes an object key and constructs the full public HTTPS URL.
    const constructS3PublicUrl = (s3Key) => {
        const BUCKET_NAME = 'registrants2025';
        // Make sure this is your bucket's actual region
        const BUCKET_REGION = 'ap-southeast-1';
        return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${s3Key}`;
    };

    function formatDuration(totalSeconds) {
        // Handle non-numeric or negative inputs gracefully
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return "00:00";
        }

        // 1. Calculate the minutes by dividing by 60 and taking the integer part
        const minutes = Math.floor(totalSeconds / 60);

        // 2. Calculate the remaining seconds using the modulo operator
        const seconds = totalSeconds % 60;

        // 3. Pad both numbers with a leading zero if they are less than 10
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        // 4. Combine them into the final format
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    const handleExportToExcel = () => {
        if (!allData || allData.length === 0) {
            message.warn("No data available to export.");
            return;
        }

        message.info("Preparing your complete Excel file for download...");

        // --- NEW: DUPLICATE DETECTION LOGIC ---
        // 1. Count occurrences of each YouTube link
        const linkCounts = allData.reduce((acc, registrant) => {
            const link = registrant.youtubeLink;
            if (link) { // Only count non-empty links
                acc[link] = (acc[link] || 0) + 1;
            }
            return acc;
        }, {});

        // 2. Create a map of tags for only the links that are duplicates
        const duplicateTags = {};
        let duplicateCounter = 1;
        for (const link in linkCounts) {
            if (linkCounts[link] > 1) {
                duplicateTags[link] = `duplicate${duplicateCounter}`;
                duplicateCounter++;
            }
        }
        // --- END OF NEW LOGIC ---

        const dataForExport = [];
        let rowCounter = 1; // Use a separate counter for the 'No.' column

        // 1. Loop through each REGISTRATION
        allData.forEach(registrant => {
            // Get the shared data that's the same for all performers in this registration
            const sharedData = {
                'Parent/Teacher Name': registrant.name,
                'Teacher Name': registrant.teacherName,
                'Competition Category': registrant.competitionCategory,
                'Instrument Category': registrant.instrumentCategory,
                'Age Category': registrant.ageCategory,
                'Performance Category': registrant.PerformanceCategory,
                'YouTube Link': registrant.youtubeLink,
                'Duplicate Link Tag': duplicateTags[registrant.youtubeLink] || '', // Get tag or empty string
                'Video Duration': formatDuration(registrant.videoDuration),
                'Repertoire PDF': registrant.pdfRepertoireS3Link,
                'Birth Certificate': registrant.birthCertS3Link,
                'Exam Certificate': registrant.examCertificateS3Link,
                'Profile Photo': registrant.profilePhotoS3Link,
                'Registration Date': registrant.createdAt ? new Date(registrant.createdAt.seconds * 1000).toLocaleString('en-GB') : '',
                'Payment Status': registrant.paymentStatus,
            };

            // Check if the registration is for an Ensemble
            if (registrant.PerformanceCategory === 'Ensemble') {
                // If it is, combine all performer data into a SINGLE row
                const combinedNames = registrant.performers.map(p => `${p.firstName} ${p.lastName}`).join(' & ');
                const combinedEmails = registrant.performers.map(p => p.email).join(', ');
                const combinedDOBs = registrant.performers.map(p => p.dob).join(', ');
                const combinedPhones = registrant.performers.map(p => p.phoneNumber).join(', ');

                dataForExport.push({
                    'No.': rowCounter++,
                    'Name': combinedNames,
                    'Email': registrant.performers[0]?.email,
                    'Date of Birth': combinedDOBs,
                    'Phone Number': combinedPhones,
                    'Country': registrant.performers[0]?.country, // Take country/city from the first performer
                    'City': registrant.performers[0]?.city,
                    ...sharedData
                });
            } else {
                // Otherwise (for Solo, Duet, etc.), create a SEPARATE row for each performer
                registrant.performers.forEach(performer => {
                    dataForExport.push({
                        'No.': rowCounter++,
                        'Name': `${performer.firstName} ${performer.lastName}`,
                        'Email': performer.email,
                        'Date of Birth': performer.dob,
                        'Phone Number': performer.phoneNumber,
                        'Country': performer.country,
                        'City': performer.city,
                        ...sharedData
                    });
                });
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("All Registrants & Performers");

        // The rest of the ExcelJS logic works perfectly with this new data structure
        const headers = Object.keys(dataForExport[0]);
        worksheet.getRow(1).values = headers;
        worksheet.getRow(1).font = { bold: true };

        dataForExport.forEach(item => {
            const row = worksheet.addRow(Object.values(item));
            const repertoireIndex = headers.indexOf('Repertoire PDF') + 1;
            if (repertoireIndex > 0) {
                const cell = row.getCell(repertoireIndex);
                if (cell.value) {
                    cell.value = {
                        text: 'View PDF',
                        hyperlink: constructS3PublicUrl(getS3KeyFromUri(cell.value)),
                    };
                    cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                }
            }
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                let columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, "All_Registrants_and_Performers_2025.xlsx");
        });
    };

    const handleDownloadPDF = async (record) => {
        const filesToDownload = [
            { fileName: stripS3Prefix(record.birthCertS3Link) },
            { fileName: stripS3Prefix(record.examCertificateS3Link) },
            { fileName: stripS3Prefix(record.pdfRepertoireS3Link) },
            { fileName: stripS3Prefix(record.profilePhotoS3Link) },
        ];

        try {
            const response = await apis.aws.downloadFiles(filesToDownload)


            const blob = new Blob([response.data], { type: 'application/zip' });

            // Programmatically trigger an invisible download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'documents.zip'; // 👈 Desired filename
            link.style.display = 'none'; // Keep it hidden
            document.body.appendChild(link);
            link.click(); // 👈 Trigger download
            link.remove(); // Clean up
            window.URL.revokeObjectURL(url); // Clean up blob URL
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleDownloadAll = async () => {
        if (!allData || allData.length === 0) {
            message.warn("No registrant data available to download.");
            return;
        }

        setIsDownloadingAll(true);
        message.loading({ content: `Preparing ${allData.length} registrant folders for download...`, key: 'downloadAll', duration: 0 });

        try {
            const payload = [];

            // 1. Create a detailed list of every file and its desired folder path
            allData.forEach(registrant => {
                const category = registrant.competitionCategory || 'Uncategorized';
                const performerName = `${registrant.performers[0]?.firstName}_${registrant.performers[0]?.lastName}`.replace(/ /g, '_');
                const registrantFolder = `${category}/${performerName}_${registrant.id.slice(0, 6)}`;

                // A helper to add files to the payload
                const addFile = (s3Link, fileName) => {
                    if (s3Link) {
                        payload.push({
                            s3Key: stripS3Prefix(s3Link),
                            zipPath: `${registrantFolder}/${fileName}`
                        });
                    }
                };

                addFile(registrant.birthCertS3Link, 'birth_certificate.pdf');
                addFile(registrant.examCertificateS3Link, 'exam_certificate.pdf');
                addFile(registrant.pdfRepertoireS3Link, 'repertoire.pdf');
                addFile(registrant.profilePhotoS3Link, 'profile_photo.jpg'); // Assuming jpg, adjust if needed
            });

            console.log("payload", payload)
            // 2. Call the new backend API with the payload
            const response = await apis.aws.downloadAllFiles(payload, {
                responseType: 'blob' // Important: tell axios to expect binary data
            });

            // 3. Trigger the download in the browser
            const blob = new Blob([response.data], { type: 'application/zip' });
            saveAs(blob, "all_registrants_documents.zip");

            message.success({ content: 'Your download has started!', key: 'downloadAll' });

        } catch (error) {
            console.error('Download all failed:', error);
            message.error({ content: 'Failed to download documents.', key: 'downloadAll' });
        } finally {
            setIsDownloadingAll(false);
        }
    };

    const updatePaymentStatus = async (record) => {
        try {
            const docRef = doc(db, 'Registrants2025', record.id);
            await updateDoc(docRef, {
                paymentStatus: "PAID"
            });
            message.success({ content: `Successfully updated registrant(s)!`, key: 'updateStatus' });
            fetchUserData(1)
        } catch (error) {
            console.error("Error updating document(s): ", error);
        }
    };

    // --- NEW HANDLER FUNCTIONS FOR THE MODAL ---
    const showEditModal = (record) => {
        setEditingRecord(record);
        // Populate the form state from the selected record
        setEditFormState({
            firstName: record.performers[0]?.firstName || '',
            lastName: record.performers[0]?.lastName || '',
            youtubeLink: record.youtubeLink || '',
            email: record.performers[0]?.email || '',

        });
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingRecord(null);
        setEditFormState({ firstName: '', lastName: '', youtubeLink: '', email: '' });
    };

    // A single handler for all input changes in the modal
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        if (!editingRecord) return;

        setIsSaving(true);
        try {
            // Firestore requires us to update the entire 'performers' array.
            // 1. Make a copy of the original performers array.
            const updatedPerformers = [...editingRecord.performers];

            // 2. Update the name for the first performer in our copy.
            updatedPerformers[0] = {
                ...updatedPerformers[0],
                firstName: editFormState.firstName,
                lastName: editFormState.lastName,
                email: editFormState.email,

            };

            // 3. Prepare the final payload with the new youtubeLink and the modified performers array.
            const updatePayload = {
                youtubeLink: editFormState.youtubeLink,
                performers: updatedPerformers,
            };

            const docRef = doc(db, 'Registrants2025', editingRecord.id);
            await updateDoc(docRef, updatePayload);

            message.success('Registrant data updated successfully!');
            fetchUserData(page);
            handleEditCancel();

        } catch (error) {
            console.error("Error updating registrant data: ", error);
            message.error('Failed to update data.');
        } finally {
            setIsSaving(false);
        }
    };


    const columns = getRegistrants2025Columns(handleDownloadPDF, updatePaymentStatus, showEditModal, handleDeleteRegistrant, deletingId);

    const handleRecheckDurations = async () => {
        setIsUpdating(true);
        setProgress(0);
        setUpdateMessage("Fetching all registrant data...");

        try {
            const querySnapshot = await getDocs(collection(db, "Registrants2025"));
            const allDocs = querySnapshot.docs;
            const total = allDocs.length;

            if (total === 0) {
                message.info("No registrants to update.");
                setIsUpdating(false);
                return;
            }

            let batch = writeBatch(db);
            let operationsCount = 0;
            let updatedCount = 0;

            for (let i = 0; i < total; i++) {
                const docSnap = allDocs[i];
                const registrant = docSnap.data();

                const performerName = registrant.performers[0]?.firstName || registrant.name;
                setUpdateMessage(`(${i + 1}/${total}) Checking video for ${performerName}...`);

                const videoId = extractVideoId(registrant.youtubeLink);
                if (videoId) {
                    // This now calls the real, promisified function from your utils
                    const newDuration = await fetchYouTubeDuration(videoId);

                    if (newDuration !== null && newDuration !== registrant.videoDuration) {
                        batch.update(docSnap.ref, { videoDuration: newDuration });
                        operationsCount++;
                        updatedCount++;
                    }
                }

                setProgress(Math.round(((i + 1) / total) * 100));

                if (operationsCount === 499) {
                    await batch.commit();
                    batch = writeBatch(db);
                    operationsCount = 0;
                }
            }

            if (operationsCount > 0) {
                await batch.commit();
            }

            message.success(`Process complete! ${updatedCount} video durations were updated.`);
            fetchUserData(page);

        } catch (error) {
            console.error("Failed during bulk update:", error);
            message.error("An error occurred during the update process.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUploadRegistrantAPCS2025 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        message.loading({ content: 'Reading and processing your file...', key: 'upload' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = event.target.result;
                const workbook = xlsx.read(data, { type: "array", cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // --- CORRECTED PARSING LOGIC ---
                // 1. Parse the entire sheet into an array of arrays to get full control.
                const rowsAsArrays = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                // 3. Manually extract the header row (row 2) and the data rows (row 4 onwards).
                const headers = rowsAsArrays[0];
                const dataRows = rowsAsArrays.slice(1); // Skips banner, header, and example row.

                // 4. Manually convert the arrays into an array of objects using the headers.
                const json = dataRows.map(rowArray => {
                    const rowObject = {};
                    headers.forEach((header, index) => {
                        if (header) { // Only add data for columns that have a header
                            rowObject[header] = rowArray[index];
                        }
                    });
                    return rowObject;
                });
                // --- END OF CORRECTED PARSING LOGIC ---


                if (json.length === 0) {
                    message.error({ content: 'The uploaded file has no data to process.', key: 'upload' });
                    setIsUploading(false);
                    return;
                }

                message.loading({ content: `Processing ${json.length} records...`, key: 'upload' });

                // Helper to parse strings like "1,5 mins" or "3 mins" into seconds
                const parseDurationToSeconds = (durationStr) => {
                    if (typeof durationStr !== 'string' || !durationStr) return 0;
                    try {
                        const cleanedStr = durationStr.replace(',', '.').replace('mins', '').trim();
                        const minutes = parseFloat(cleanedStr);
                        return Math.round(minutes * 60);
                    } catch (e) {
                        return 0;
                    }
                };

                // Helper to split a full name into first and last names
                const splitFullName = (fullName) => {
                    if (typeof fullName !== 'string' || !fullName) return { firstName: '', lastName: '' };
                    const parts = fullName.trim().split(' ');
                    const lastName = parts.pop();
                    const firstName = parts.join(' ');
                    return { firstName, lastName };
                };

                const registrantsToUpload = json.map(row => {
                    console.log("row", row)
                    // Use the helper to split the full name
                    const { firstName, lastName } = splitFullName(row['Full Name']);

                    const performer = {
                        firstName: firstName,
                        lastName: lastName,
                        email: row['Email'] || '',
                        dob: parseDateString(row['Date of Birth']), // Use your reliable date parser
                        gender: row['Gender'] || '',
                        nationality: row['Nationality'] || 'Indonesia',
                        country: row['Country'] || 'Indonesia',
                        province: row['Province'] || '',
                        city: row['City'] || '',
                        zipCode: String(row['Zip Code'] || ''),
                        addressLine: row['addressline'] || '',
                        phoneNumber: row['Phone Number'] || '',
                        countryCode: row['Country Code'] || '+62',
                    };

                    return {
                        // Top-level Info (assuming these might not be in the sheet)
                        name: row['Parent/Guardian Name'] || '',
                        userType: row['User Type'] || 'Teacher',
                        teacherName: row['Teacher Name'] || '',

                        // Competition Details from the sheet
                        competitionCategory: row['Competition Category'] || 'Piano', // Example default
                        instrumentCategory: row['Instrument Category'] || '',
                        ageCategory: String(row['Age'] || ''), // Convert age number to string for ageCategory
                        PerformanceCategory: row['Performance Category'] || 'Solo',

                        // Links from the file
                        youtubeLink: row['YouTube Link'] || '',
                        pdfRepertoireS3Link: row['Repertoire'] || '',
                        profilePhotoS3Link: row['Photo'] || '', // Assuming a 'Photo' column might exist
                        birthCertS3Link: row['Birth Certificate'] || '',
                        examCertificateS3Link: row['Recommendation Letter / Exam Certificate'] || '',

                        // Nested Performer Data
                        performers: [performer],

                        // Default / Generated Values
                        totalPerformer: 1,
                        agreement: true,
                        paymentStatus: 'PAID',
                        videoDuration: parseDurationToSeconds(row['Max Duration']),
                        createdAt: serverTimestamp(),
                    };
                });

                console.log("registrantsToUpload", registrantsToUpload)

                // Batch Upload Step
                message.loading({ content: `Uploading ${registrantsToUpload.length} documents to Firestore...`, key: 'upload' });
                const batchSize = 499;
                for (let i = 0; i < registrantsToUpload.length; i += batchSize) {
                    const batch = writeBatch(db);
                    const chunk = registrantsToUpload.slice(i, i + batchSize);

                    chunk.forEach((registrantData) => {
                        const newDocRef = doc(collection(db, "Registrants2025Dummy"));
                        batch.set(newDocRef, registrantData);
                    });

                    await batch.commit();
                }

                // --- NEW: INTELLIGENTLY GROUP EMAILS BEFORE SENDING ---
                const groupedEmails = registrantsToUpload.reduce((acc, registrant) => {
                    const performer = registrant.performers[0];
                    if (!performer || !performer.email) return acc; // Skip if no email

                    const email = performer.email.toLowerCase();
                    const name = `${performer.firstName} ${performer.lastName}`;

                    if (!acc[email]) {
                        // If this is the first time we see this email, create a new entry
                        acc[email] = {
                            email: performer.email,
                            competitionCategory: registrant.competitionCategory,
                            instrumentCategory: registrant.instrumentCategory,
                            names: [name] // Start a new list of names
                        };
                    } else {
                        // If we've seen this email before, just add the new name to the list
                        acc[email].names.push(name);
                    }

                    return acc;
                }, {});

                console.log("groupedEmails", groupedEmails)

                // Convert the grouped object back into an array for the API
                const emailPayload = Object.values(groupedEmails);

                // --- Send the consolidated email payload to the backend ---
                if (emailPayload.length > 0) {
                    await apis.email.sendEmailNotifyBulkUpdateRegistrant(emailPayload);
                }

                message.success({ content: `Successfully uploaded ${registrantsToUpload.length} registrants!`, key: 'upload' });
                fetchUserData(1);

            } catch (error) {
                console.error("Error processing or uploading file:", error);
                message.error({ content: 'An error occurred. Please check the console for details.', key: 'upload' });
            } finally {
                setIsUploading(false);
                e.target.value = null;
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // console.log("registrantDatas", registrantDatas)

    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <Input.Search
                placeholder="Search by performer name..."
                onSearch={value => {
                    setPage(1); // Reset to first page on new search
                    setSearchTerm(value);
                }}
                onChange={e => {
                    // Optional: live search as the user types
                    if (e.target.value === '') {
                        setSearchTerm('');
                    }
                }}
                style={{ marginBottom: 16, maxWidth: 400 }}
                allowClear
            />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    overflow: 'auto',
                }}
            >
                <Table columns={columns} dataSource={registrantDatas} onChange={handlePageChange} pagination={false} />
                <Pagination
                    className='mt-16'
                    current={page}
                    pageSize={pageSize}
                    total={totalDocs} // Total number of items
                    onChange={handlePageChange}
                    showSizeChanger={false}
                // onShowSizeChange={onShowSizeChange}
                />
            </div>
            <form style={{ background: "white" }}>
                <label htmlFor="Save Registrand to DB" >Upload Registrant To Database </label>
                <input
                    type="file"
                    name="upload"
                    id="upload"
                    onChange={handleUploadRegistrantAPCS2025}
                    style={{ marginLeft: 4 }}
                />
            </form>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Button type="primary" onClick={handleExportToExcel}>Export to excel</Button>

                <Button
                    style={{ marginLeft: 8 }}
                    onClick={handleRecheckDurations}
                    loading={isUpdating} // Use the new loading state
                >
                    Re-check All YouTube Durations
                </Button>

                <Button
                    style={{ marginLeft: 8 }}
                    onClick={handleDownloadAll}
                    loading={isDownloadingAll}
                >
                    Download All Documents
                </Button>
            </div>
            <Modal
                title="Updating Video Durations"
                open={isUpdating}
                footer={null}
                closable={false}
            >
                <p>{updateMessage}</p>
                <Progress percent={progress} />
                <p style={{ marginTop: '10px', textAlign: 'center' }}>Please keep this tab open until the process is complete.</p>
            </Modal>
            <Modal
                title="Edit Registrant Details"
                open={isEditModalVisible}
                onOk={handleEditSave}
                onCancel={handleEditCancel}
                confirmLoading={isSaving}
                okText="Save"
            >
                {editingRecord && (
                    <Form layout="vertical">
                        <Form.Item label="Performer First Name">
                            <Input
                                name="firstName"
                                value={editFormState.firstName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="Performer Last Name">
                            <Input
                                name="lastName"
                                value={editFormState.lastName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input
                                name="email"
                                value={editFormState.email}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="YouTube Link">
                            <Input
                                name="youtubeLink"
                                value={editFormState.youtubeLink}
                                onChange={handleEditFormChange}
                                placeholder="https://youtube.com/..."
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Content>
    )
}

export default RegistrantDashboard;