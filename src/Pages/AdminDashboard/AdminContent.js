import { Layout, Table, theme } from 'antd';
import React, { useState } from 'react';
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

        </Content>
    )
}

export default AdminContent;