import React, { useContext, useEffect, useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { DataContext } from '../../context/DataContext';
import { getAuth, signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";

import { db } from '../../firebase';
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
                {
                    text: 'Category 1',
                    value: 'Category 1',
                },
                {
                    text: 'Category 2',
                    value: 'Category 2',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.startsWith(value),
            width: '30%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Address',
            dataIndex: 'address',
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

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
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
                <Table columns={columns} dataSource={data} onChange={onChange} />
            </div>
        </Content>
    )
}

export default UserContent;