import { Button, Popconfirm, Space } from 'antd';

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

export const getRegistrants2025Columns = (handleDownloadPDF, handleUpdateStatus, showEditModal, handleDelete, deletingId) => [
    { title: "Parent Name", dataIndex: "name" },
    { title: "Teacher Name", dataIndex: "teacherName" },
    { title: "Total Performer", dataIndex: "totalPerformer" },
    { title: "Competition Category", dataIndex: "competitionCategory" },
    { title: "Performance Category", dataIndex: "PerformanceCategory" },
    { title: "User Type", dataIndex: "userType" },
    { title: "Payment Status", dataIndex: "paymentStatus" },
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
                return date.toLocaleString();
            }
            return "-";
        },
    },
    {
        title: 'Actions',
        key: 'actions',
        // The render function now calls the handlers passed as arguments
        render: (text, record) => (
            <div>
                <Button type="link" onClick={() => handleDownloadPDF(record)}>
                    Download PDF
                </Button>

                <Button type="primary" onClick={() => handleUpdateStatus(record)}>
                    Mark as Paid
                </Button>
            </div>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle">
                <Button type="link" onClick={() => showEditModal(record)}>
                    Edit
                </Button>

                <Popconfirm
                    title="Delete the registrant"
                    description="Are you sure you want to delete this registrant? This action cannot be undone."
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes, Delete"
                    cancelText="No"
                >
                    <Button
                        type="link"
                        danger // This makes the button text red
                        loading={deletingId === record.id} // Show spinner only on the clicked button
                    >
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
];


// const updatePaymentStatus = async () => {
//     // First, check if any rows have been selected
//     if (selectedRowKeys.length === 0) {
//         message.error("Please select at least one registrant to update.");
//         return;
//     }

//     message.loading({ content: `Updating ${selectedRowKeys.length} registrant(s)...`, key: 'updateStatus' });

//     try {
//         // Create an array of all the update promises
//         const updatePromises = selectedRowKeys.map(registrantId => {
//             // Get a reference to the specific document in the 'Registrant2025' collection
//             const docRef = doc(db, 'Registrant2025', registrantId);

//             // Return the promise from the updateDoc call
//             // Here we update the paymentStatus field. You can add more fields if needed.
//             return updateDoc(docRef, {
//                 paymentStatus: "PAID"
//             });
//         });

//         // Use Promise.all to run all updates in parallel for better performance
//         await Promise.all(updatePromises);

//         message.success({ content: `Successfully updated ${selectedRowKeys.length} registrant(s)!`, key: 'updateStatus' });

//         // 3. Refresh the data in the table to show the change
//         // and clear the selection.
//         fetchData(page); // Replace with your actual function to refetch data
//         setSelectedRowKeys([]);

//     } catch (error) {
//         console.error("Error updating document(s): ", error);
//         message.error({ content: `Failed to update status. Error: ${error.message}`, key: 'updateStatus' });
//     }
// };