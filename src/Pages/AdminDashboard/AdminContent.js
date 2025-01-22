import { Layout, Table, theme } from 'antd';
import React, { useState } from 'react';
import { RegistrantsColumns } from '../../constant/RegistrantsColumn';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { BlobProvider } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import ReactDOM from "react-dom";

const { Content } = Layout;

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        textAlign: 'center',
    },
    recipientName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    courseTitle: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    completionDate: {
        fontSize: 16,
        marginTop: 20,
    },
    signature: {
        marginTop: 50,
        fontSize: 16,
        fontStyle: 'italic',
    },
    signatureLine: {
        marginTop: 10,
        borderBottom: '1px solid black',
        width: '50%',
        alignSelf: 'center',
    }
});

const AdminContent = () => {
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const [isLoading, setIsLoading] = useState(false)

    const { registrantDatas, loading, error, page, setPage, totalPages } = usePaginatedRegistrants(10);

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
                            <View style={styles.section}>
                                <Text>{data.name}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>Section #2</Text>
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
                <Table columns={RegistrantsColumns} dataSource={registrantDatas} onChange={handlePageChange} />
            </div>
            <button onClick={generatePdf}>Generate PDFs</button>

        </Content>
    )
}

export default AdminContent;