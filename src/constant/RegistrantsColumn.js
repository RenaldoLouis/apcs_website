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
    { title: "Agreement", dataIndex: "agreement" },
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
    { title: "Created At", dataIndex: "createdAt" },
];
