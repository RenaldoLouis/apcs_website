import { Button, Layout, message, Pagination, Table, theme } from 'antd';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { doc, updateDoc } from "firebase/firestore";
import JSZip from "jszip";
import apis from '../../apis';
import { getRegistrants2025Columns } from '../../constant/RegistrantsColumn';
import { db } from '../../firebase';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Content } = Layout;

const RegistrantDashboard = () => {
    const pageSize = 10

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const { registrantDatas, page, setPage, totalDocs, allData, loading, fetchUserData } = usePaginatedRegistrants(pageSize, "Registrants2025", "createdAt");

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

    const handleExportToExcel = () => {
        const data = registrantDatas
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        // Create a worksheet with a title
        const worksheet = workbook.addWorksheet("Registrants 2025");

        if (data.length > 0) {
            // Create headers from the keys of the first record
            const headers = Object.keys(data[0]);
            worksheet.addRow(headers);

            // Add each registrant record as a row in the worksheet
            data.forEach((item) => {
                const rowValues = headers.map((header) => {
                    let value = item[header];
                    // If the field is createdAt, convert from Firestore timestamp object to a readable date
                    if (header === "createdAt" && value) {
                        // Convert seconds to a JavaScript Date (ignoring nanoseconds)
                        value = new Date(value.seconds * 1000).toLocaleString();
                    }
                    // Optionally, convert null to an empty string
                    if (value === null) {
                        value = "";
                    }
                    return value;
                });
                worksheet.addRow(rowValues);
            });
        } else {
            worksheet.addRow(["No data available"]);
        }

        // Generate Excel file and trigger download
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, "registrant2025.xlsx");
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

    const columns = getRegistrants2025Columns(handleDownloadPDF, updatePaymentStatus);

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
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Button type="primary" onClick={handleExportToExcel}>Export to excel</Button>
            </div>
        </Content>
    )
}

export default RegistrantDashboard;