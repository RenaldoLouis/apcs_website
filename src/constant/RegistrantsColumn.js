import moment from 'moment';

export const RegistrantsColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'Joe',
                value: 'Joe',
            },
        ],
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.name.startsWith(value),
    },
    {
        title: 'Assigned On',
        dataIndex: 'assigned_on',
        render: (assignedOn) => {
            if (!assignedOn) {
                return 'N/A'; // Default for null or undefined
            }
            const timestamp = assignedOn.seconds * 1000 + Math.floor(assignedOn.nanoseconds / 1e6); // Convert to milliseconds
            return moment(timestamp).format('YYYY-MM-DD'); // Format as desired
        },
    },
    {
        title: 'Extra note',
        dataIndex: 'extra_note',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Teacher',
        dataIndex: 'teacher',
    },
];