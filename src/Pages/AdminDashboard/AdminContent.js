import { Layout, Table, theme } from 'antd';
import React, { useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { RegistrantsColumns } from '../../constant/RegistrantsColumn';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Content } = Layout;

const AdminContent = () => {
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const [isLoading, setIsLoading] = useState(false)

    const { registrantDatas, loading, error, page, setPage, totalPages } = usePaginatedRegistrants(10);

    const handlePageChange = (pagination, filters, sorter, extra) => {
        setPage(pagination);
    };

    const availableTimeslots = [0, 1, 2, 3, 4, 5].map((id) => {
        return {
            id,
            startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
            endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(17, 0, 0, 0)),
        };
    });

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
            <ScheduleMeeting
                borderRadius={10}
                primaryColor="#3f5b85"
                eventDurationInMinutes={30}
                availableTimeslots={availableTimeslots}
                onStartTimeSelect={console.log}
            />

        </Content>
    )
}

export default AdminContent;