import { Button } from "antd";
import apis from "../apis";

export const RegistrantsColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Achievement',
        dataIndex: 'achievement',
    },
    {
        title: 'Category',
        dataIndex: 'category',
    },
    {
        title: 'City',
        dataIndex: 'city',
    },
    {
        title: 'Teacher',
        dataIndex: 'teacher',
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
    },
];

export const Registrants2025Columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Total Performer", dataIndex: "totalPerformer" },
    { title: "Competition Category", dataIndex: "competitionCategory" },
    { title: "Performance Category", dataIndex: "PerformanceCategory" },
    { title: "User Type", dataIndex: "userType" },
    {
        title: "Performers",
        dataIndex: "performers",
        render: (performers) => {
            if (Array.isArray(performers)) {
                return performers.map((p, i) => (
                    <div key={i}>{i + 1}. {p.firstName} {p.lastName}</div>
                ));
            }
            return "-";
        },
    },
    { title: "YouTube Link", dataIndex: "youtubeLink" },
    { title: "Age Category", dataIndex: "ageCategory" },
    { title: "Instrument Category", dataIndex: "instrumentCategory" },
    {
        title: "Created At", dataIndex: "createdAt",
        render: (createdAt) => {
            if (createdAt?.seconds) {
                const date = new Date(createdAt.seconds * 1000);
                return date.toLocaleString(); // or date.toLocaleDateString(), etc.
            }
            return "-";
        },
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, record, index) => (
            <Button type="link" onClick={() => handleDownloadPDF(record, index)}>
                Download PDF
            </Button>
        ),
    }
];

const stripS3Prefix = (uri) => {
    const parts = uri.split('/');
    // Remove 's3:', '', 'bucket-name'
    return parts.slice(3).join('/');
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