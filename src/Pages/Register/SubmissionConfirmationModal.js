import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Box, Modal, Typography } from '@mui/material';
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
                        Before submitting, please review your registration carefully. Once submitted, your information cannot be changed.
                    </Typography>
                </Box>

                <Divider style={{ borderColor: '#444', margin: '20px 0' }} />

                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                    <strong>  By submitting, you confirm that:</strong>
                </Typography>
                <ul style={{ color: '#ccc', paddingLeft: '20px', fontSize: '14px', marginTop: '10px' }}>
                    <li>All details (name, category, and files) are correct.</li>
                    <li>You are responsible for any mistakes or missing information.</li>
                    <li>Incorrect submissions (e.g., wrong category, broken links) may not be accepted, and fees are non-refundable.</li>
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