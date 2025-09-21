import React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Space } from 'antd';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1E1E1E',
    color: '#fff',
    border: `1px solid #EBBC64`,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    borderRadius: '16px',
    p: { xs: 2, sm: 3, md: 4 },
    outline: 'none',
    maxWidth: '550px',
    width: '90%',
};

const SubmissionConfirmationModal = ({ open, onCancel, onConfirm, isLoading }) => {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null} // We will create custom footer buttons
            closable={false}
            centered
        >
            <Box sx={modalStyle}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#EBBC64' }}>
                        Please Confirm Your Details
                    </Typography>
                    <CloseOutlined onClick={onCancel} style={{ cursor: 'pointer', fontSize: '18px' }} />
                </Box>

                <Box sx={{ width: '100%' }}>
                    <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#EBBC64', float: 'left', marginRight: '16px' }} />
                    <Typography sx={{ color: '#ccc' }}>
                        Please take a final moment to review your registration. By submitting, you confirm that all information is correct.
                    </Typography>
                </Box>

                <Divider style={{ borderColor: '#444', margin: '20px 0' }} />

                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                    You Acknowledge That:
                </Typography>
                <ul style={{ color: '#ccc', paddingLeft: '20px', fontSize: '14px', marginTop: '10px' }}>
                    <li>All names, categories, and submitted files are accurate and final.</li>
                    <li>You are fully responsible for any errors in the data provided.</li>
                    <li>Submissions with incorrect data (e.g., broken links, wrong category) may not be processed or judged, and entry fees for such cases will not be refunded.</li>
                </ul>

                <Divider style={{ borderColor: '#444', margin: '20px 0' }} />

                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>
                        Go Back & Edit
                    </Button>
                    <Button
                        type="primary"
                        onClick={onConfirm}
                        loading={isLoading}
                        style={{
                            backgroundColor: '#EBBC64',
                            borderColor: '#EBBC64',
                            color: '#1E1E1E',
                            fontWeight: 600
                        }}
                    >
                        Confirm & Submit
                    </Button>
                </Space>
            </Box>
        </Modal>
    );
};

export default SubmissionConfirmationModal;