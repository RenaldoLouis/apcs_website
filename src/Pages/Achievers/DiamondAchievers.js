import { PlusOutlined, SearchOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Form, Input, message, Modal, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import amrFlag from "../../assets/images/amrFlag.jpg";
import chinaflag from "../../assets/images/chinaflag.jpg";
import denmarkflag from "../../assets/images/denmarkflag.jpg"; // fidland
import diamondAchieversText from "../../assets/images/diamondAchieversText.svg";
import estoniaFlag from "../../assets/images/estoniaFlag.png";
import finlandFlag from "../../assets/images/finlandFlag.png";
import japanFlag from "../../assets/images/Flag_of_Japan.png";
import hongkongFLag from "../../assets/images/hongkongFlag.png";
import hungaryFlag from "../../assets/images/hungaryFlag.png";
import indFlag from "../../assets/images/indFlag.jpg";
import italyFlag from "../../assets/images/italyFlag.png";
import koreaflag from "../../assets/images/koreaflag.jpg";
import russiaflag from "../../assets/images/russiaflag.jpg"; //estonia
import singaporeFlag from "../../assets/images/singaporeFlag.png";
import turkeyFlag from "../../assets/images/turkeyFlag.png";
import AchieversHeader from '../../components/molecules/AchieversHeader';
import { CountryAchiever } from '../../constant/CountryConst';
import { ListOfCity } from '../../constant/ListOfCity';
import { ListOfEventAchiever } from '../../constant/ListOfEventAchiever';
import { useAuth } from '../../context/DataContext';
import {
    addAchieverToFirestore,
    fetchAchieversFromFirestore,
    filterAchieversByCity,
    filterAchieversByEvent,
    searchAchieversByName
} from '../../utils/AchieversMigration';

const { Option } = Select;
const { Search } = Input;

const DiamondAchievers = () => {
    const { currentUser, isMobileAndSmaller } = useAuth();
    const { t } = useTranslation();
    const isAdmin = currentUser?.role === 'admin';

    // State Management
    const [achievers, setAchievers] = useState([]);
    const [filteredAchievers, setFilteredAchievers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal for adding achievers (Admin only)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Initial Data Fetch
    useEffect(() => {
        loadAchievers();
    }, []);

    // Apply Filters
    useEffect(() => {
        applyFilters();
    }, [achievers, selectedEvent, selectedCity, searchTerm]);

    const loadAchievers = async () => {
        setLoading(true);
        try {
            const data = await fetchAchieversFromFirestore();
            setAchievers(data);
            setFilteredAchievers(data);
        } catch (error) {
            console.error('Error loading achievers:', error);
            message.error('Failed to load achievers');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...achievers];

        // Filter by event
        result = filterAchieversByEvent(result, selectedEvent);

        // Filter by city
        result = filterAchieversByCity(result, selectedCity);

        // Search by name
        result = searchAchieversByName(result, searchTerm);

        setFilteredAchievers(result);
    };

    const handleEventChange = (value) => {
        setSelectedEvent(value);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleResetFilters = () => {
        setSelectedEvent('all');
        setSelectedCity('all');
        setSearchTerm('');
    };

    const handleAddAchiever = async (values) => {
        try {
            const result = await addAchieverToFirestore({
                name: values.name,
                country: values.country,
                YoutubeLink: values.youtubeLink || "",
                event: values.events || [],
                order: achievers.length // Add to end
            });

            if (result.success) {
                setIsModalVisible(false);
                form.resetFields();
                loadAchievers(); // Reload data
            }
        } catch (error) {
            console.error('Error adding achiever:', error);
        }
    };

    const openYoutubeLink = (link) => {
        if (link && link !== "-" && link !== "") {
            window.open(link, '_blank');
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
            <div className="container">
                {/* Header */}
                <AchieversHeader
                    title={`${t("Acv3")}`}
                    subTitle={t("Acv3A")}
                    image={diamondAchieversText}
                    description={t("Acv4")}
                    description2={t("Acv4A")}
                    description3={t("Acv4B")} />

                {/* Filters */}
                <div className="row mb-4" style={{ background: '#1E1E1E', padding: '24px', borderRadius: '12px' }}>
                    <div className="col-md-3 mb-3">
                        <label style={{ color: '#EBBC64', marginBottom: 8, display: 'block' }}>Filter by Event</label>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedEvent}
                            onChange={handleEventChange}
                            placeholder="Select Event"
                        >
                            <Option value="all">All Events</Option>
                            {Object.entries(ListOfEventAchiever).map(([key, value]) => (
                                <Option key={key} value={key}>{value}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-md-3 mb-3">
                        <label style={{ color: '#EBBC64', marginBottom: 8, display: 'block' }}>Filter by City</label>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedCity}
                            onChange={handleCityChange}
                            placeholder="Select City"
                        >
                            <Option value="all">All Cities</Option>
                            {Object.entries(ListOfCity).map(([key, value]) => (
                                <Option key={key} value={value}>{value}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label style={{ color: '#EBBC64', marginBottom: 8, display: 'block' }}>Search by Name</label>
                        <Search
                            placeholder="Search achiever name..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="col-md-2 mb-3" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                            onClick={handleResetFilters}
                            style={{ width: '100%', height: 40 }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>

                {/* Admin: Add Achiever Button */}
                {isAdmin && (
                    <div className="row mb-4">
                        <div className="col text-end">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    background: '#EBBC64',
                                    borderColor: '#EBBC64',
                                    color: '#000'
                                }}
                            >
                                Add New Achiever
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="row mb-3">
                    <div className="col">
                        <p style={{ color: '#e5cc92' }}>
                            Showing {filteredAchievers.length} of {achievers.length} achievers
                        </p>
                    </div>
                </div>

                {/* Achievers Grid */}
                {loading ? (
                    <div className="row">
                        <div className="col text-center" style={{ padding: '60px 0' }}>
                            <Spin size="large" />
                            <p style={{ color: '#e5cc92', marginTop: 16 }}>Loading achievers...</p>
                        </div>
                    </div>
                ) : filteredAchievers.length === 0 ? (
                    <div className="row">
                        <div className="col">
                            <Empty
                                description={
                                    <span style={{ color: '#999' }}>
                                        No achievers found matching your criteria
                                    </span>
                                }
                                style={{ padding: '60px 0' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredAchievers.map((achiever, index) => {
                            const flagIcon = (country) => {
                                switch (country) {
                                    case CountryAchiever.DNMRK:
                                        return denmarkflag;

                                    case CountryAchiever.IDN:
                                        return indFlag;

                                    case CountryAchiever.KR:
                                        return koreaflag;

                                    case CountryAchiever.RSA:
                                        return russiaflag;

                                    case CountryAchiever.CHI:
                                        return chinaflag;

                                    case CountryAchiever.AMR:
                                        return amrFlag;

                                    case CountryAchiever.JP:
                                        return japanFlag;

                                    case CountryAchiever.ITL:
                                        return italyFlag;

                                    case CountryAchiever.FIN:
                                        return finlandFlag;

                                    case CountryAchiever.HUN:
                                        return hungaryFlag;

                                    case CountryAchiever.HK:
                                        return hongkongFLag;

                                    case CountryAchiever.SR:
                                        return singaporeFlag;

                                    case CountryAchiever.TRK:
                                        return turkeyFlag;

                                    case CountryAchiever.EST:
                                        return estoniaFlag;

                                    default:
                                        return indFlag;

                                }
                            }
                            return (
                                <div key={achiever.id || index} className="col-md-4 col-sm-6">
                                    <Card
                                        style={{
                                            background: '#1E1E1E',
                                            borderColor: '#333',
                                            borderRadius: '12px',
                                            height: '100%',
                                            transition: 'all 0.3s ease'
                                        }}
                                        hoverable
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#EBBC64';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#333';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ marginBottom: 16 }}>
                                            <h3 style={{
                                                color: '#EBBC64',
                                                fontSize: '18px',
                                                marginBottom: 8,
                                                minHeight: '48px'
                                            }}>
                                                {achiever.name}
                                            </h3>

                                            <p style={{ color: '#e5cc92', marginBottom: 4 }}>

                                                <img src={flagIcon(achiever.country)} alt={"indFlag"} style={{ marginRight: 13, width: 25 }} /> {achiever.city}
                                            </p>
                                        </div>

                                        {/* Events */}
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{
                                                color: '#999',
                                                fontSize: '12px',
                                                marginBottom: 8
                                            }}>
                                                Events:
                                            </div>
                                            {achiever.event && achiever.event.length > 0 ? (
                                                achiever.event.map((eventKey, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            background: '#2a2a2a',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            marginBottom: '4px',
                                                            fontSize: '11px',
                                                            color: '#ccc'
                                                        }}
                                                    >
                                                        {ListOfEventAchiever[eventKey] || eventKey}
                                                    </div>
                                                ))
                                            ) : (
                                                <span style={{ color: '#666', fontSize: '12px' }}>
                                                    No events listed
                                                </span>
                                            )}
                                        </div>

                                        {/* YouTube Button */}
                                        {achiever.YoutubeLink &&
                                            achiever.YoutubeLink !== "-" &&
                                            achiever.YoutubeLink !== "" && (
                                                <Button
                                                    icon={<YoutubeOutlined />}
                                                    onClick={() => openYoutubeLink(achiever.YoutubeLink)}
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: 'transparent',
                                                        borderColor: '#e5cc92', // Elegant gold
                                                        color: '#e5cc92',
                                                        borderWidth: '2px',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Watch Performance
                                                </Button>
                                            )}
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Add Achiever Modal (Admin Only) */}
            <Modal
                title={<span style={{ color: '#EBBC64' }}>Add New Achiever</span>}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddAchiever}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input placeholder="Enter achiever name" />
                    </Form.Item>

                    <Form.Item
                        name="country"
                        label="City"
                        rules={[{ required: true, message: 'Please select city' }]}
                    >
                        <Select placeholder="Select city">
                            {Object.entries(ListOfCity).map(([key, value]) => (
                                <Option key={key} value={value}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="youtubeLink"
                        label="YouTube Link"
                    >
                        <Input placeholder="https://youtube.com/..." />
                    </Form.Item>

                    <Form.Item
                        name="events"
                        label="Events"
                        rules={[{ required: true, message: 'Please select at least one event' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select events"
                        >
                            {Object.entries(ListOfEventAchiever).map(([key, value]) => (
                                <Option key={key} value={key}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Achiever
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiamondAchievers;