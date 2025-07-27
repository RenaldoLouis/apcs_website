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

    const handleExportToExcel = () => {
        const data = []; // assuming registrantDatas comes from your hook
        registrantDatas.forEach((eachData, index) => {
            const tempObj = {
                no: index + 1,
                Contestant: `${eachData.performers[0].firstName} ${eachData.performers[0].lastName}`,
                PDF_Repertoire: eachData.pdfRepertoireS3Link,
                Performance_Video: eachData.youtubeLink
            }
            data.push(tempObj)
        })

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registrants 2025");

        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            worksheet.addRow(headers);

            data.forEach((item) => {
                const rowValues = headers.map((header) => {
                    let value = item[header];

                    if (header === "createdAt" && value?.seconds) {
                        value = new Date(value.seconds * 1000).toLocaleString();
                    }

                    // --- THIS IS THE KEY LOGIC ---
                    // If the column is for the public repertoire link, format it as a hyperlink
                    if (header === "PDF_Repertoire" && value) {
                        const s3Key = getS3KeyFromUri(value);

                        if (s3Key) {
                            const publicUrl = constructS3PublicUrl(s3Key);
                            // ExcelJS requires this specific object format for hyperlinks
                            value = {
                                text: 'View Repertoire PDF', // The text that will appear in the cell
                                hyperlink: publicUrl,
                                tooltip: publicUrl, // Optional: show URL on hover
                            };
                        }
                    }
                    // --- END OF KEY LOGIC ---

                    if (value === null || typeof value === 'undefined') {
                        value = "";
                    }
                    // Handle objects that are not hyperlinks (like the performers array)
                    if (typeof value === 'object' && !value.hyperlink) {
                        value = JSON.stringify(value);
                    }

                    return value;
                });
                worksheet.addRow(rowValues);
            });
        } else {
            worksheet.addRow(["No data available"]);
        }

        // Generate Excel file
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