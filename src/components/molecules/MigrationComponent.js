import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Progress, Space } from 'antd';
import { useState } from 'react';
import { migrateAchieversToFirestore } from '../../utils/AchieversMigration';

/**
 * ONE-TIME MIGRATION COMPONENT
 * Use this once to migrate your JSON data to Firestore
 * After migration, you can delete this component
 */
const MigrationComponent = () => {
    const [migrating, setMigrating] = useState(false);
    const [migrated, setMigrated] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);

    const handleMigration = async () => {
        setMigrating(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const migrationResult = await migrateAchieversToFirestore();
            // const migrationResult = await migrateAchieversToFirestore(dataDiamond);

            clearInterval(progressInterval);
            setProgress(100);
            setResult(migrationResult);

            if (migrationResult.success) {
                setMigrated(true);
            }
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Migration error:', error);
            setResult({ success: false, error: error.message });
        } finally {
            setMigrating(false);
        }
    };

    return (
        <div style={{
            background: '#121212',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card
                style={{
                    background: '#1E1E1E',
                    borderColor: '#EBBC64',
                    maxWidth: 600,
                    width: '100%'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#EBBC64', marginBottom: 24 }}>
                        Diamond Achievers Migration
                    </h2>

                    <Alert
                        message="Important"
                        description="This will upload all achievers data to Firestore. Run this only ONCE. After successful migration, you can delete this component."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 24, textAlign: 'left' }}
                    />

                    <div style={{
                        background: '#2a2a2a',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: 24
                    }}>
                        {/* <p style={{ color: '#e5cc92', margin: 0 }}>
                            <strong>Total Achievers to Migrate:</strong> {dataDiamond.length}
                        </p> */}
                    </div>

                    {migrating && (
                        <div style={{ marginBottom: 24 }}>
                            <Progress
                                percent={progress}
                                status={progress === 100 ? "success" : "active"}
                                strokeColor="#EBBC64"
                            />
                            <p style={{ color: '#e5cc92', marginTop: 8 }}>
                                Migrating data to Firestore...
                            </p>
                        </div>
                    )}

                    {migrated && result?.success && (
                        <Alert
                            message="Migration Successful!"
                            description={`Successfully migrated ${result.count} achievers to Firestore. You can now delete this migration component and use the new Achievers page.`}
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                            style={{ marginBottom: 24, textAlign: 'left' }}
                        />
                    )}

                    {result && !result.success && (
                        <Alert
                            message="Migration Failed"
                            description={result.error || 'An error occurred during migration. Check console for details.'}
                            type="error"
                            showIcon
                            style={{ marginBottom: 24, textAlign: 'left' }}
                        />
                    )}

                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<UploadOutlined />}
                            onClick={handleMigration}
                            loading={migrating}
                            disabled={migrated}
                            style={{
                                background: migrated ? '#52c41a' : '#EBBC64',
                                borderColor: migrated ? '#52c41a' : '#EBBC64',
                                color: '#000'
                            }}
                        >
                            {migrated ? 'Migration Complete' : 'Start Migration'}
                        </Button>

                        {migrated && (
                            <Button
                                size="large"
                                onClick={() => window.location.href = '/achievers'}
                            >
                                Go to Achievers Page
                            </Button>
                        )}
                    </Space>

                    <div style={{
                        marginTop: 32,
                        padding: '16px',
                        background: '#2a2a2a',
                        borderRadius: '8px',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ color: '#EBBC64', marginBottom: 12 }}>
                            Migration Steps:
                        </h4>
                        <ol style={{ color: '#e5cc92', paddingLeft: 20 }}>
                            <li>Click "Start Migration" button</li>
                            <li>Wait for the process to complete</li>
                            <li>Verify data in Firebase Console</li>
                            <li>Delete this migration component</li>
                            <li>Remove dataDiamond.js from your project</li>
                        </ol>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MigrationComponent;