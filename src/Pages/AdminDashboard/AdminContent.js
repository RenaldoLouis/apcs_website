import { Layout, Table, theme, Pagination } from 'antd';
import React, { useState } from 'react';
import { RegistrantsColumns } from '../../constant/RegistrantsColumn';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { BlobProvider } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import ReactDOM from "react-dom";
import * as xlsx from 'xlsx';
import RegistrantAssignment from '../../components/molecules/AdminContentComponent/RegistrantAssignment';
import { db } from '../../firebase';
import { collection, writeBatch, doc } from "firebase/firestore";

const { Content } = Layout;

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#F9F9F9',
        padding: 50,
        border: '5px solid #4CAF50',
        borderRadius: 10,
    },
    borderContainer: {
        border: '3px solid #000',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20,
        color: '#4CAF50',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    bodyText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
    },
    recipientName: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        textDecoration: 'underline',
    },
    courseTitle: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#555',
    },
    completionDate: {
        fontSize: 16,
        marginTop: 30,
        textAlign: 'center',
        color: '#333',
    },
    signatureContainer: {
        marginTop: 50,
        textAlign: 'center',
    },
    signatureLabel: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    signatureLine: {
        borderBottom: '2px solid black',
        width: 200,
        margin: '0 auto',
        marginTop: 10,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
        color: '#888',
    }
});

const AdminContent = () => {
    const pageSize = 10

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const { registrantDatas, page, setPage, totalDocs } = usePaginatedRegistrants(pageSize);

    const handlePageChange = (pagination, filters, sorter, extra) => {
        setPage(pagination);
    };

    const generatePdf = async () => {
        try {
            const pdfBlobs = await Promise.all(
                registrantDatas.map((eachData) => generatePdfUrl(eachData))
            );
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
                        if (!loading && !error && blob) {
                            resolve(blob);
                        } else if (error) {
                            reject(error);
                        }
                        return null;
                    }}
                </BlobProvider>
            );
            ReactDOM.render(pdfElement, document.createElement("div"));
        });
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

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[1];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                // console.log(json)
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    const handleUploadRegistrant = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                console.log("workbook", workbook)
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                console.log(json)

                // to save to Users DB
                const batch = writeBatch(db);
                const usersCollection = collection(db, "Registrants");

                json.forEach((data) => {
                    const newDocRef = doc(usersCollection); // Auto-generate a new document ID
                    batch.set(newDocRef, data);
                });

                try {
                    await batch.commit(); // Save all documents in a single batch
                    console.log("Batch write successful!");
                } catch (error) {
                    console.error("Error writing batch:", error);
                }
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Table columns={RegistrantsColumns} dataSource={registrantDatas} onChange={handlePageChange} pagination={false} />
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
            <button onClick={generatePdf}>Generate PDFs</button>
            <form>
                <label htmlFor="upload">Upload File</label>
                <input
                    type="file"
                    name="upload"
                    id="upload"
                    onChange={readUploadFile}
                />
            </form>
            <form>
                <label htmlFor="Save Registrand to DB">Uplad Registrant</label>
                <input
                    type="file"
                    name="upload"
                    id="upload"
                    onChange={handleUploadRegistrant}
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
                <RegistrantAssignment />
            </div>
        </Content>
    )
}

export default AdminContent;