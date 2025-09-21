import { WarningOutlined } from '@ant-design/icons';
import { Box, Modal, Typography } from '@mui/material';
import { Button } from 'antd';

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
    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
    outline: 'none',
    maxWidth: '550px',
    width: '90%',
};

const WelcomeModalRegister = ({ open, handleClose }) => {
    return (
        <Modal
            open={open}
            // onClose={handleClose}
            aria-labelledby="payment-warning-title"
            aria-describedby="payment-warning-description"
        >
            <Box sx={modalStyle}>
                {/* Header */}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Typography id="payment-warning-title" variant="h5" sx={{ fontWeight: 700, color: '#EBBC64' }}>
                        Important Payment Instruction
                    </Typography>
                    {/* <CloseOutlined onClick={handleClose} style={{ cursor: 'pointer', fontSize: '18px' }} /> */}
                </Box>

                {/* Warning Icon and Content */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <WarningOutlined style={{ fontSize: '48px', color: '#EBBC64', marginBottom: '16px' }} />

                    <Typography id="payment-warning-description" sx={{ color: '#ccc', mb: 3 }}>
                        Please include your <strong>Payment Reference</strong> in the <strong>remarks/notes/message </strong> of your bank transfer, and make sure it matches what you write in this form.
                    </Typography>


                    {/* Example Box */}
                    <Box sx={{ background: '#2A2A2A', padding: '12px 20px', borderRadius: '8px', mb: 3, width: '100%' }}>
                        <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                            Example:
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '16px', color: '#fff' }}>
                            JohnDoe - Piano - Poco
                        </Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '16px', color: '#fff' }}>
                            (name - instrument - age category)
                        </Typography>
                    </Box>

                    <Typography sx={{ color: '#ccc', mb: 3, fontStyle: 'italic', fontSize: '14px' }}>
                        Without this, we may not be able to confirm your registration.
                    </Typography>

                    {/* Confirmation Button */}
                    <Button
                        onClick={handleClose}
                        style={{
                            backgroundColor: '#EBBC64',
                            borderColor: '#EBBC64',
                            color: '#1E1E1E',
                            fontWeight: 600
                        }}
                    >
                        I Understand
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default WelcomeModalRegister;