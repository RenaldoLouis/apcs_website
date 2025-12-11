import { CommentOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Row, Spin, Statistic, Timeline, Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
    getRegistrantScores,
    getScoreStatistics
} from '../../utils/JuryScoreUtils';

const { Title, Text, Paragraph } = Typography;

/**
 * Component to display all jury feedback for a registrant
 * Use this in admin dashboard or when sending feedback to registrants
 */
const RegistrantFeedbackViewer = ({ registrantId, registrantName }) => {
    const [scores, setScores] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (registrantId) {
            loadFeedback();
        }
    }, [registrantId]);

    const loadFeedback = async () => {
        try {
            setLoading(true);
            const [scoresData, stats] = await Promise.all([
                getRegistrantScores(registrantId),
                getScoreStatistics(registrantId)
            ]);

            setScores(scoresData);
            setStatistics(stats);
        } catch (error) {
            console.error('Error loading feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#52c41a'; // Green
        if (score >= 75) return '#faad14'; // Orange
        if (score >= 60) return '#ff7a45'; // Light red
        return '#ff4d4f'; // Red
    };

    if (loading) {
        return (
            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading feedback...</div>
            </Card>
        );
    }

    if (!scores || scores.length === 0) {
        return (
            <Card>
                <Empty
                    description="No jury feedback available yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Statistics Section */}
            <Card
                style={{
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
                    border: '1px solid #EBBC64'
                }}
            >
                <Title level={3} style={{ color: '#EBBC64', marginBottom: 24 }}>
                    Jury Feedback for {registrantName}
                </Title>

                {statistics && (
                    <Row gutter={24}>
                        <Col xs={24} sm={8}>
                            <Card style={{ background: '#2A2A2A', textAlign: 'center' }}>
                                <Statistic
                                    title={<span style={{ color: '#e5cc92' }}>Average Score</span>}
                                    value={statistics.average}
                                    precision={2}
                                    valueStyle={{ color: getScoreColor(statistics.average), fontSize: 36 }}
                                    prefix={<TrophyOutlined />}
                                    suffix="/ 100"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card style={{ background: '#2A2A2A', textAlign: 'center' }}>
                                <Statistic
                                    title={<span style={{ color: '#e5cc92' }}>Score Range</span>}
                                    value={`${statistics.min} - ${statistics.max}`}
                                    valueStyle={{ color: '#EBBC64', fontSize: 28 }}
                                    prefix={<StarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card style={{ background: '#2A2A2A', textAlign: 'center' }}>
                                <Statistic
                                    title={<span style={{ color: '#e5cc92' }}>Total Evaluations</span>}
                                    value={statistics.count}
                                    valueStyle={{ color: '#EBBC64', fontSize: 36 }}
                                    prefix={<CommentOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Card>

            {/* Individual Jury Feedback */}
            <Card
                title={<span style={{ color: '#EBBC64' }}>Detailed Feedback</span>}
                style={{
                    background: '#1E1E1E',
                    border: '1px solid #333'
                }}
            >
                <Timeline mode="left">
                    {scores.map((score, index) => (
                        <Timeline.Item
                            key={score.id}
                            color={getScoreColor(score.score)}
                            dot={
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: getScoreColor(score.score),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}>
                                    {score.score}
                                </div>
                            }
                        >
                            <Card
                                size="small"
                                style={{
                                    background: '#2A2A2A',
                                    border: `2px solid ${getScoreColor(score.score)}`,
                                    marginBottom: 16
                                }}
                            >
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong style={{ color: '#EBBC64', fontSize: 16 }}>
                                        {score.juryName || 'Anonymous Jury'}
                                    </Text>
                                    <Text style={{ color: '#999', marginLeft: 16 }}>
                                        {score.timestamp?.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </div>

                                <Divider style={{ margin: '12px 0', borderColor: '#444' }} />

                                <div style={{ marginTop: 12 }}>
                                    <Text style={{ color: '#e5cc92' }}>Score: </Text>
                                    <Text
                                        strong
                                        style={{
                                            color: getScoreColor(score.score),
                                            fontSize: 20
                                        }}
                                    >
                                        {score.score}/100
                                    </Text>
                                </div>

                                {score.comment && (
                                    <div style={{ marginTop: 16 }}>
                                        <Text style={{ color: '#e5cc92', display: 'block', marginBottom: 8 }}>
                                            Comment:
                                        </Text>
                                        <Paragraph
                                            style={{
                                                color: '#fff',
                                                background: '#1E1E1E',
                                                padding: 16,
                                                borderRadius: 8,
                                                borderLeft: '4px solid #EBBC64',
                                                marginBottom: 0
                                            }}
                                        >
                                            {score.comment}
                                        </Paragraph>
                                    </div>
                                )}
                            </Card>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>
        </div>
    );
};

export default RegistrantFeedbackViewer;