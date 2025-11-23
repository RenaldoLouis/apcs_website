import {
    FilePdfOutlined,
    LogoutOutlined,
    SaveOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Input,
    InputNumber,
    Layout,
    Modal,
    Space,
    Table,
    Tabs,
    Typography
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DataContext'; // Assuming you have this context

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// --- THEME COLORS ---
const COLORS = {
    background: '#121212',
    cardBg: '#1E1E1E',
    gold: '#EBBC64',
    cream: '#e5cc92',
    text: '#ffffff',
    subText: '#aaaaaa',
    border: '#333333'
};

// --- DUMMY DATA ---
const DUMMY_CONTESTANTS = [
    {
        id: '1',
        name: 'Caroline Christie',
        category: 'Poco',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example
        repertoireFile: 'https://example.com/file1.pdf',
        score: 85,
        comment: 'Great expression, but watch the tempo in bar 12.',
    },
    {
        id: '2',
        name: 'Michael Tan',
        category: 'Poco',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        repertoireFile: 'https://example.com/file2.pdf',
        score: null,
        comment: '',
    },
    {
        id: '3',
        name: 'Sarah Lee',
        category: 'Primary',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        repertoireFile: 'https://example.com/file3.pdf',
        score: 92,
        comment: 'Excellent technique! Very impressive.',
    },
];

const JuryDashboard = () => {
    const navigate = useNavigate();
    const { signOut, user } = useAuth(); // Get user and signOut from your context

    const [activeCategory, setActiveCategory] = useState('Poco');
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);

    // Local state to handle edits before saving to DB
    const [contestantData, setContestantData] = useState(DUMMY_CONTESTANTS);

    // --- HANDLERS ---

    const handleLogout = async () => {
        await signOut();
        // navigate('/login');
    };

    const handleScoreChange = (id, value) => {
        setContestantData(prev => prev.map(c => c.id === id ? { ...c, score: value } : c));
    };

    const handleCommentChange = (id, value) => {
        setContestantData(prev => prev.map(c => c.id === id ? { ...c, comment: value } : c));
    };

    const handleSave = (record) => {
        // TODO: Call API to save score and comment to Firebase
        console.log('Saving data for:', record.name, { score: record.score, comment: record.comment });
        // Show success toast/message here
    };

    const openVideo = (url) => {
        setCurrentVideo(url);
        setVideoModalOpen(true);
    };

    // --- TABLE COLUMNS ---
    const columns = [
        {
            title: 'Contestant Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong style={{ color: COLORS.cream, fontSize: '16px' }}>{text}</Text>,
        },
        {
            title: 'Materials',
            key: 'materials',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        onClick={() => openVideo(record.videoUrl)}
                        style={{ backgroundColor: '#2C2C2C', borderColor: COLORS.gold, color: COLORS.gold }}
                    >
                        Watch Video
                    </Button>
                    <Button
                        type="link"
                        icon={<FilePdfOutlined />}
                        href={record.repertoireFile}
                        target="_blank"
                        style={{ color: COLORS.cream }}
                    >
                        Repertoire
                    </Button>
                </Space>
            ),
        },
        {
            title: 'Jury Assessment',
            key: 'assessment',
            width: '45%',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Text style={{ color: COLORS.subText }}>Score (0-100):</Text>
                        <InputNumber
                            min={0}
                            max={100}
                            value={record.score}
                            onChange={(val) => handleScoreChange(record.id, val)}
                            style={{
                                width: '80px',
                                backgroundColor: '#121212',
                                color: COLORS.gold,
                                borderColor: '#444'
                            }}
                        />
                    </div>
                    <TextArea
                        placeholder="Write your comments here..."
                        rows={3}
                        value={record.comment}
                        onChange={(e) => handleCommentChange(record.id, e.target.value)}
                        style={{
                            backgroundColor: '#121212',
                            color: '#fff',
                            borderColor: '#444',
                            resize: 'none'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => handleSave(record)}
                        style={{
                            alignSelf: 'flex-end',
                            backgroundColor: COLORS.gold,
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none'
                        }}
                    >
                        Save Assessment
                    </Button>
                </div>
            ),
        },
    ];

    // Filter data based on active tab
    const filteredData = contestantData.filter(c => c.category === activeCategory);

    // --- TABS ITEMS ---
    const ageCategories = ['Poco', 'Primary', 'Junior', 'Senior', 'Professional'];
    const tabItems = ageCategories.map(cat => ({
        key: cat,
        label: cat,
    }));

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>

            {/* 1. TOP NAVIGATION BAR */}
            <Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#000',
                borderBottom: `1px solid ${COLORS.border}`,
                padding: '0 30px',
                height: '70px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="https://apcsgalery.s3.ap-southeast-1.amazonaws.com/assets/apcs_logo_white_background_black.png" alt="Logo" style={{ height: '40px' }} />
                    <div style={{ height: '25px', width: '1px', backgroundColor: '#444' }}></div>
                    <Title level={4} style={{ color: COLORS.gold, margin: 0, letterSpacing: '1px' }}>
                        JURY PORTAL
                    </Title>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Space>
                        <Avatar style={{ backgroundColor: COLORS.gold, color: '#000' }} icon={<UserOutlined />} />
                        <Text style={{ color: '#fff' }}>{user?.displayName || "Jury Member"}</Text>
                    </Space>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: '#ff4d4f' }}
                    >
                        Sign Out
                    </Button>
                </div>
            </Header>

            {/* 2. MAIN CONTENT AREA */}
            <Content style={{ padding: '40px 50px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Header Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <Title level={2} style={{ color: '#fff', marginBottom: '10px' }}>
                            Evaluation Dashboard
                        </Title>
                        <Text style={{ color: COLORS.subText }}>
                            Review contestant videos, download repertoire, and submit your scores.
                        </Text>
                    </div>

                    {/* 3. TABS & TABLE */}
                    <div style={{
                        backgroundColor: COLORS.cardBg,
                        padding: '24px',
                        borderRadius: '12px',
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        <Tabs
                            activeKey={activeCategory}
                            onChange={setActiveCategory}
                            items={tabItems}
                            type="card"
                            className="custom-jury-tabs"
                            tabBarStyle={{ marginBottom: '24px', borderBottom: `1px solid ${COLORS.border}` }}
                        />

                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            className="jury-table"
                            // Customizing empty state style
                            locale={{ emptyText: <Text style={{ color: COLORS.subText }}>No contestants in this category</Text> }}
                        />
                    </div>
                </div>
            </Content>

            {/* VIDEO MODAL */}
            <Modal
                open={videoModalOpen}
                onCancel={() => setVideoModalOpen(false)}
                footer={null}
                width={800}
                centered
                bodyStyle={{ backgroundColor: '#000', padding: 0 }}
                closeIcon={<span style={{ color: '#fff' }}>X</span>}
            >
                {currentVideo && (
                    <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            src={currentVideo}
                            title="Contestant Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </Modal>

            {/* CSS OVERRIDES for Ant Design components to match Dark Theme */}
            <style>{`
                .custom-jury-tabs .ant-tabs-tab {
                    background-color: #121212 !important;
                    border-color: #333 !important;
                    color: #aaa !important;
                }
                .custom-jury-tabs .ant-tabs-tab-active {
                    background-color: ${COLORS.gold} !important;
                    color: #000 !important;
                    border-bottom-color: ${COLORS.gold} !important;
                }
                .custom-jury-tabs .ant-tabs-nav::before {
                    border-bottom: 1px solid #333 !important;
                }
                
                /* Table Styles */
                .jury-table .ant-table {
                    background-color: transparent;
                    color: #fff;
                }
                .jury-table .ant-table-thead > tr > th {
                    background-color: #2A2A2A;
                    color: ${COLORS.gold};
                    border-bottom: 1px solid #444;
                }
                .jury-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #333;
                }
                .jury-table .ant-table-tbody > tr:hover > td {
                    background-color: #252525 !important;
                }
                .jury-table .ant-pagination-item-active {
                    border-color: ${COLORS.gold};
                }
                .jury-table .ant-pagination-item-active a {
                    color: ${COLORS.gold};
                }
                .jury-table .ant-pagination-item a {
                    color: #fff;
                }
                .jury-table .ant-pagination-prev .ant-pagination-item-link,
                .jury-table .ant-pagination-next .ant-pagination-item-link {
                    color: #fff;
                }
            `}</style>
        </Layout>
    );
};

export default JuryDashboard;