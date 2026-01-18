import { BlobProvider, Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Button, Form, Input, Layout, Modal, Pagination, Select, Table, message, theme } from 'antd';
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from 'react';
import ReactDOM from "react-dom";
import * as xlsx from 'xlsx';
import apis from '../../apis'; // Ensure this points to your API configuration
import RegistrantAssignment from '../../components/molecules/AdminContentComponent/RegistrantAssignment';
import MigrationComponent from '../../components/molecules/MigrationComponent';
import { competitionList } from '../../constant/RegisterPageConst';
import { RegistrantsColumns } from '../../constant/RegistrantsColumn';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Content } = Layout;
const { Option } = Select;

// PDF Styles (Kept as is)
const styles = StyleSheet.create({
    page: { backgroundColor: '#F9F9F9', padding: 50, border: '5px solid #4CAF50', borderRadius: 10 },
    borderContainer: { border: '3px solid #000', padding: 20, borderRadius: 10 },
    title: { fontSize: 32, textAlign: 'center', marginBottom: 20, color: '#4CAF50', fontWeight: 'bold', textTransform: 'uppercase' },
    subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 30, color: '#333' },
    bodyText: { fontSize: 18, textAlign: 'center', marginBottom: 10, color: '#555' },
    recipientName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 20, textDecoration: 'underline' },
    courseTitle: { fontSize: 20, marginTop: 10, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', color: '#555' },
    completionDate: { fontSize: 16, marginTop: 30, textAlign: 'center', color: '#333' },
    signatureContainer: { marginTop: 50, textAlign: 'center' },
    signatureLabel: { fontSize: 16, fontStyle: 'italic', marginBottom: 10 },
    signatureLine: { borderBottom: '2px solid black', width: 200, margin: '0 auto', marginTop: 10 },
    footerText: { fontSize: 12, textAlign: 'center', marginTop: 30, color: '#888' }
});

const AdminContent = () => {
    const pageSize = 10;
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const { registrantDatas, page, setPage, totalDocs, allData, loading, fetchUserData } = usePaginatedRegistrants(pageSize, "Registrants", "achievement");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    const handlePageChange = (pagination) => {
        setPage(pagination);
    };

    // --- PDF Logic ---
    const generatePdf = async () => {
        try {
            const pdfBlobs = await Promise.all(registrantDatas.map((eachData) => generatePdfUrl(eachData)));
            await createAndDownloadZip(pdfBlobs);
        } catch (error) {
            console.error("Error generating PDFs:", error);
        }
    };

    const generatePdfUrl = (data) => {
        return new Promise((resolve, reject) => {
            const pdfElement = (
                <BlobProvider document={
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.borderContainer}>
                                <Text style={styles.title}>Certificate of Completion</Text>
                                <Text style={styles.subtitle}>This is to certify that</Text>
                                <Text style={styles.recipientName}>{data.name}</Text>
                                <Text style={styles.bodyText}>has successfully completed the course</Text>
                                <Text style={styles.courseTitle}>{data.courseTitle}</Text>
                                <Text style={styles.completionDate}>Date of Completion: {data.date}</Text>
                                <View style={styles.signatureContainer}>
                                    <Text style={styles.signatureLabel}>Authorized Signature</Text>
                                    <View style={styles.signatureLine}></View>
                                </View>
                                <Text style={styles.footerText}>This certificate is presented with great honor and recognition.</Text>
                            </View>
                        </Page>
                    </Document>
                }>
                    {({ blob, loading, error }) => {
                        if (!loading && !error && blob) resolve(blob);
                        else if (error) reject(error);
                        return null;
                    }}
                </BlobProvider>
            );
            ReactDOM.render(pdfElement, document.createElement("div"));
        });
    };

    async function createAndDownloadZip(pdfBlobs) {
        const zip = new JSZip();
        for (let i = 0; i < pdfBlobs.length; i++) {
            const blob = pdfBlobs[i];
            let currentData = registrantDatas[i];
            zip.file(`${currentData.name}-${i}.pdf`, blob);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "registrant.zip");
    }

    // --- Excel Upload Logic ---
    const handleUploadRegistrant = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet, { raw: true });
                console.log("JSON Data:", json);
                // const parsedData = json.map((row) => {
                //     if (row.duration && typeof row.duration === "number") {
                //         row.duration = convertExcelTimeToDuration(row.duration);
                //     }
                //     return row;
                // });

                // console.log("parsedData", parsedData);

                // // to save to Users DB
                // const batch = writeBatch(db);
                // const usersCollection = collection(db, "Registrants");

                // parsedData.forEach((data) => {
                //     const newDocRef = doc(usersCollection); // Auto-generate a new document ID
                //     batch.set(newDocRef, data);
                // });

                // try {
                //     await batch.commit(); // Save all documents in a single batch
                //     console.log("Batch write successful!");
                // } catch (error) {
                //     console.error("Error writing batch:", error);
                // }
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    // --- Create Jury Logic ---
    const handleCreateJurySubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Using your existing 'apis' structure
            await apis.jury.createJury(values);

            message.success(`Jury member ${values.name} created successfully!`);
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Failed to create jury", error);
            // Handle error response from backend if available
            const errorMsg = error.response?.data?.error || "Failed to create jury.";
            message.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>

                {/* Header Actions */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Create New Jury
                    </Button>
                    {/* <Button onClick={generatePdf}>Generate PDFs</Button> */}
                </div>

                {/* Main Table */}
                <Table
                    columns={RegistrantsColumns}
                    dataSource={registrantDatas}
                    onChange={handlePageChange}
                    pagination={false}
                    loading={loading}
                />

                <Pagination
                    className='mt-16'
                    current={page}
                    pageSize={pageSize}
                    total={totalDocs}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>

            {/* Upload Section */}
            <div style={{ marginTop: 20, padding: 20, background: 'white', borderRadius: 8 }}>
                <form>
                    <label style={{ fontWeight: 'bold', marginRight: 10 }}>Upload Registrant To Database:</label>
                    <input type="file" onChange={handleUploadRegistrant} accept=".xlsx, .xls" />
                </form>
            </div>

            <MigrationComponent />

            <div style={{ padding: 24, marginTop: 20, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                <RegistrantAssignment allData={allData} isLoading={loading} />
            </div>

            {/* Create Jury Modal */}
            <Modal
                title="Create New Jury Member"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateJurySubmit}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="jury@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter a password (min 6 chars)' }]}
                    >
                        <Input.Password placeholder="******" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Competition Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select category">
                            {Object.keys(competitionList).map((data) => (
                                <Option value={data}>{data}</Option>

                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Create Jury
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
};

export default AdminContent;