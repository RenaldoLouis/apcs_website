import React from 'react';
import { Layout, theme } from 'antd';
import { Table } from 'antd';
import usePaginatedUsers from '../../hooks/useFetchUsersData';
import apis from '../../apis';

const { Content } = Layout;

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
        setPage(pagination);
    };

    const handleClickSendEmail = () => {
        console.log("userDatas", userDatas)
        const listEmail = userDatas.map((eachData) => ({
            email: eachData.email
        }))
        try {
            // setIsLoading(true)
            apis.email.sendEmail(listEmail).then((res) => {
                if (res.status === 200) {
                    // setIsLoading(false)
                } else {
                    // setIsLoading(false)
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

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
            <button onClick={handleClickSendEmail}>sendEmail</button>

        </Content>
    )
}

export default UserContent;