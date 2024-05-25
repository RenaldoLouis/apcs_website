import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Table } from 'antd';
import usePaginatedUsers from '../../hooks/useFetchUsersData';

const { Header, Content, Footer, Sider } = Layout;

const UserContent = () => {

    const { userDatas, loading, error, page, setPage, totalPages } = usePaginatedUsers(10);

    const columns = [
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
            title: 'Phone Number',
            dataIndex: 'phone_number',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            filters: [
                {
                    text: 'London',
                    value: 'London',
                },
                {
                    text: 'New York',
                    value: 'New York',
                },
            ],
            onFilter: (value, record) => record.address.startsWith(value),
            filterSearch: true,
            width: '20%',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            filters: [
                {
                    text: 'London',
                    value: 'London',
                },
                {
                    text: 'New York',
                    value: 'New York',
                },
            ],
            onFilter: (value, record) => record.address.startsWith(value),
            filterSearch: true,
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            filters: [
                {
                    text: 'London',
                    value: 'London',
                },
                {
                    text: 'New York',
                    value: 'New York',
                },
            ],
            onFilter: (value, record) => record.address.startsWith(value),
            filterSearch: true,
            width: '40%',
        },
    ];

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const handlePageChange = (pagination, filters, sorter, extra) => {
        console.log("pagination", pagination)
        setPage(pagination);
    };

    console.log("userDatas", userDatas)

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
                <Table columns={columns} dataSource={userDatas} onChange={handlePageChange} />
            </div>
        </Content>
    )
}

export default UserContent;