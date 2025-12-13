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
    message,
    Modal,
    Space,
    Spin,
    Table,
    Tabs,
    Typography
} from 'antd';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apis from '../../apis';
import {
    ageCategories,
    guitarAgeCategoriesEnsemble,
    guitarAgeCategoriesSolo,
    harpAgeCategoriesEnsemble,
    harpAgeCategoriesSolo,
} from '../../constant/RegisterPageConst';
import { useAuth } from '../../context/DataContext';
import { db } from '../../firebase';

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

/**
 * Get S3 presigned URL for private files
 */
// const getPresignedUrl = async (s3Link) => {
//     if (!s3Link || !s3Link.startsWith('s3://')) return null;

//     try {
//         const key = s3Link.replace('s3://registrants2025/', '');
//         const command = new GetObjectCommand({
//             Bucket: 'registrants2025',
//             Key: key
//         });
//         return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
//     } catch (error) {
//         console.error('Error generating presigned URL:', error);
//         return null;
//     }
// };

/**
 * Map age category key to full description
 */
const getAgeCategoryLabel = (ageCategoryKey, competitionCategory, performanceCategory) => {
    if (!ageCategoryKey) return '';

    const allAgeCategories = {
        ...ageCategories,
        ...harpAgeCategoriesSolo,
        ...harpAgeCategoriesEnsemble,
        ...guitarAgeCategoriesSolo,
        ...guitarAgeCategoriesEnsemble,
        // Add more as needed
    };

    return allAgeCategories[ageCategoryKey] || ageCategoryKey;
};

const JuryDashboard = () => {
    const navigate = useNavigate();
    const { signOut, loggedInUser } = useAuth();

    const [activeCategory, setActiveCategory] = useState(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [loadingVideo, setLoadingVideo] = useState(false);

    // Data states
    const [registrants, setRegistrants] = useState([]);
    const [juryScores, setJuryScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Get jury's competition category
    const juryCompetitionCategory = loggedInUser?.competitionCategory;

    useEffect(() => {
        if (!loggedInUser || loggedInUser.role !== 'jury') {
            message.error('Unauthorized access');
            navigate('/login');
            return;
        }

        if (juryCompetitionCategory) {
            fetchRegistrants();
        }
    }, [loggedInUser, juryCompetitionCategory]);

    /**
     * Fetch all registrants for this jury's category
     */
    const fetchRegistrants = async () => {
        try {
            setLoading(true);

            // Get registrants
            const registrantsQuery = query(
                collection(db, 'Registrants2025'),
                where('competitionCategory', '==', juryCompetitionCategory)
            );
            const registrantsSnap = await getDocs(registrantsQuery);

            const registrantsData = registrantsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Get existing scores from this jury
            const scoresQuery = query(
                collection(db, 'JuryScores2025'),
                where('juryUserId', '==', loggedInUser.uid)
            );
            const scoresSnap = await getDocs(scoresQuery);

            const scoresMap = {};
            scoresSnap.docs.forEach(doc => {
                const data = doc.data();
                scoresMap[data.registrantId] = {
                    score: data.score,
                    comment: data.comment
                };
            });

            setRegistrants(registrantsData);
            setJuryScores(scoresMap);

            // Set first category as active
            if (registrantsData.length > 0) {
                const categories = getAgeCategories(registrantsData);
                setActiveCategory(categories[0]);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load registrants');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get unique age categories from registrants
     */
    const getAgeCategories = (data) => {
        const categories = new Set();

        data.forEach(reg => {
            if (reg.PerformanceCategory === 'Ensemble') {
                categories.add('Ensemble');
            } else {
                const label = getAgeCategoryLabel(
                    reg.ageCategory,
                    reg.competitionCategory,
                    reg.PerformanceCategory
                );
                categories.add(label);
            }
        });

        return Array.from(categories).sort();
    };

    /**
     * Handle score change (local state)
     */
    const handleScoreChange = (registrantId, value) => {
        setJuryScores(prev => ({
            ...prev,
            [registrantId]: {
                ...prev[registrantId],
                score: value
            }
        }));
    };

    /**
     * Handle comment change (local state)
     */
    const handleCommentChange = (registrantId, value) => {
        setJuryScores(prev => ({
            ...prev,
            [registrantId]: {
                ...prev[registrantId],
                comment: value
            }
        }));
    };

    /**
     * Save score and comment to Firestore
     */
    const handleSave = async (registrant) => {
        const { id: registrantId } = registrant;
        const scoreData = juryScores[registrantId];

        if (!scoreData?.score && scoreData?.score !== 0) {
            message.warning('Please enter a score before saving');
            return;
        }

        if (scoreData.score < 0 || scoreData.score > 100) {
            message.error('Score must be between 0 and 100');
            return;
        }

        try {
            setSaving(true);

            const docId = `${registrantId}_${loggedInUser.uid}`;
            await setDoc(doc(db, 'JuryScores2025', docId), {
                registrantId,
                juryUserId: loggedInUser.uid,
                juryName: loggedInUser.name || loggedInUser.email,
                juryEmail: loggedInUser.email,
                score: scoreData.score,
                comment: scoreData.comment || '',
                competitionCategory: registrant.competitionCategory,
                ageCategory: registrant.ageCategory,
                performanceCategory: registrant.PerformanceCategory,
                registrantName: registrant.performers?.[0]?.fullName ||
                    `${registrant.performers?.[0]?.firstName} ${registrant.performers?.[0]?.lastName}`,
                timestamp: serverTimestamp(),
                isFinalized: false
            });

            message.success(`Assessment saved for ${registrant.performers?.[0]?.fullName || 'contestant'}`);
        } catch (error) {
            console.error('Error saving assessment:', error);
            message.error('Failed to save assessment');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Open video modal with S3 presigned URL
     */
    // const openVideo = async (s3Link) => {
    //     setLoadingVideo(true);
    //     setVideoModalOpen(true);

    //     try {
    //         const videoUrl = await getPresignedUrl(s3Link);
    //         if (videoUrl) {
    //             setCurrentVideo(videoUrl);
    //         } else {
    //             message.error('Failed to load video');
    //             setVideoModalOpen(false);
    //         }
    //     } catch (error) {
    //         console.error('Error loading video:', error);
    //         message.error('Failed to load video');
    //         setVideoModalOpen(false);
    //     } finally {
    //         setLoadingVideo(false);
    //     }
    // };

    const openVideo = async (s3Link) => {
        setLoadingVideo(true);
        setVideoModalOpen(true);
        let urlToPlay = null;

        try {
            const response = await apis.aws.getPublicVideoLinkAws({ s3Link });
            console.log("response", response)
            urlToPlay = response.data.url;
        } catch (error) {
            console.error("Failed to load video", error);
            message.error("Could not load video file.");
            return;
        }

        if (urlToPlay) {
            setCurrentVideo(urlToPlay);
        }
        setLoadingVideo(false);
    };

    /**
     * Open PDF in new tab
     */
    const openPDF = async (s3Link) => {
        // try {
        //     const pdfUrl = await getPresignedUrl(s3Link);
        //     if (pdfUrl) {
        //         window.open(pdfUrl, '_blank');
        //     } else {
        //         message.error('Failed to open PDF');
        //     }
        // } catch (error) {
        //     console.error('Error opening PDF:', error);
        //     message.error('Failed to open PDF');
        // }
    };

    /**
     * Handle logout
     */
    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    // --- TABLE COLUMNS ---
    const columns = [
        {
            title: 'Contestant Name',
            key: 'name',
            render: (_, record) => {
                const performer = record.performers?.[0];
                const name = performer?.fullName ||
                    `${performer?.firstName || ''} ${performer?.lastName || ''}`.trim();

                return (
                    <div>
                        <Text strong style={{ color: COLORS.cream, fontSize: '16px' }}>
                            {name}
                        </Text>
                        {record.PerformanceCategory === 'Ensemble' && record.performers?.length > 1 && (
                            <div style={{ color: COLORS.subText, fontSize: '12px', marginTop: 4 }}>
                                +{record.performers.length - 1} other{record.performers.length > 2 ? 's' : ''}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Materials',
            key: 'materials',
            render: (_, record) => (
                <Space size="middle" direction="vertical">
                    <Button
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        onClick={() => openVideo(record.videoPerformanceS3Link)}
                        style={{ backgroundColor: '#2C2C2C', borderColor: COLORS.gold, color: COLORS.gold }}
                        disabled={!record.videoPerformanceS3Link}
                    >
                        Watch Video
                    </Button>
                    <Button
                        type="link"
                        icon={<FilePdfOutlined />}
                        onClick={() => openPDF(record.pdfRepertoireS3Link)}
                        style={{ color: COLORS.cream }}
                        disabled={!record.pdfRepertoireS3Link}
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
                            value={juryScores[record.id]?.score}
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
                        value={juryScores[record.id]?.comment || ''}
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
                        loading={saving}
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
    const filteredData = registrants.filter(reg => {
        if (activeCategory === 'Ensemble') {
            return reg.PerformanceCategory === 'Ensemble';
        }

        const label = getAgeCategoryLabel(
            reg.ageCategory,
            reg.competitionCategory,
            reg.PerformanceCategory
        );
        return label === activeCategory && reg.PerformanceCategory !== 'Ensemble';
    });

    // Create tab items
    const tabItems = getAgeCategories(registrants).map(cat => ({
        key: cat,
        label: cat,
    }));

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: COLORS.background
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>
            {/* HEADER */}
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
                    <img
                        src="https://apcsgalery.s3.ap-southeast-1.amazonaws.com/assets/apcs_logo_white_background_black.png"
                        alt="Logo"
                        style={{ height: '40px' }}
                    />
                    <div style={{ height: '25px', width: '1px', backgroundColor: '#444' }}></div>
                    <Title level={4} style={{ color: COLORS.gold, margin: 0, letterSpacing: '1px' }}>
                        JURY PORTAL - {juryCompetitionCategory}
                    </Title>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Space>
                        <Avatar style={{ backgroundColor: COLORS.gold, color: '#000' }} icon={<UserOutlined />} />
                        <Text style={{ color: '#fff' }}>{loggedInUser?.name || loggedInUser?.email}</Text>
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

            {/* MAIN CONTENT */}
            <Content style={{ padding: '40px 50px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <Title level={2} style={{ color: '#fff', marginBottom: '10px' }}>
                            Evaluation Dashboard
                        </Title>
                        <Text style={{ color: COLORS.subText }}>
                            Review contestant videos, download repertoire, and submit your scores.
                        </Text>
                        <div style={{ marginTop: 12, color: COLORS.gold }}>
                            Total Registrants: {registrants.length}
                        </div>
                    </div>

                    {/* TABS & TABLE */}
                    <div style={{
                        backgroundColor: COLORS.cardBg,
                        padding: '24px',
                        borderRadius: '12px',
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        {tabItems.length > 0 ? (
                            <>
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
                                    pagination={{ pageSize: 10 }}
                                    className="jury-table"
                                    locale={{
                                        emptyText: (
                                            <div style={{ padding: '40px 0' }}>
                                                <Text style={{ color: COLORS.subText }}>
                                                    No contestants in this category
                                                </Text>
                                            </div>
                                        )
                                    }}
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Text style={{ color: COLORS.subText, fontSize: 16 }}>
                                    No registrants found for {juryCompetitionCategory}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </Content>

            {/* VIDEO MODAL */}
            <Modal
                open={videoModalOpen}
                onCancel={() => {
                    setVideoModalOpen(false);
                    setCurrentVideo(null);
                }}
                footer={null}
                width={900}
                centered
                styles={{ backgroundColor: '#000', padding: 0 }}
                closeIcon={<span style={{ color: '#fff', fontSize: 20 }}>×</span>}
            >
                {loadingVideo ? (
                    <div style={{ padding: '100px 0', textAlign: 'center' }}>
                        <Spin size="large" />
                        <div style={{ color: '#fff', marginTop: 20 }}>Loading video...</div>
                    </div>
                ) : currentVideo ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <video
                            src={currentVideo}
                            controls
                            autoPlay
                            preload="metadata" // Only download the "Index" first, not the video
                            style={{ width: '100%', maxHeight: '450px' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : null}
            </Modal>

            {/* CSS OVERRIDES */}
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