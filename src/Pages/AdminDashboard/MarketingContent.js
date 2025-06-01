import { Button, Layout, Table, theme } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../apis';
import usePaginatedUsers from '../../hooks/useFetchUsersData';

const { Content } = Layout;

const MarketingContent = () => {

    const [isLoading, setIsLoading] = useState(true)

    const { userDatas, error, page, setPage, totalPages } = usePaginatedUsers(10, setIsLoading);

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
        const listEmail = userDatas.map((eachData) => ({
            email: eachData.email,
            name: eachData.name
        }))
        try {
            setIsLoading(true)
            apis.email.sendEmailMarketing(listEmail).then((res) => {
                if (res.status === 200) {
                    toast.success("Succesfully sent email")
                }
                setIsLoading(false)
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
            <Button type="primary" onClick={handleClickSendEmail} loading={isLoading}>
                Send Email
            </Button>
        </Content>
    )
}

export default MarketingContent;