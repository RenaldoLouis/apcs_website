import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Lottie from 'lottie-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import uploadingAnimation from "../../assets/lottie/uploadingAnimation.json";

// Custom gold-colored linear progress
const GoldLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b3b3b',
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        backgroundColor: '#e5cc92',
    },
}));

function LinearProgressWithLabel({ value }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '80%', marginTop: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <GoldLinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: '#e5cc92' }}>
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

const LoadingOverlay = ({ open, progress }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.85)', // dark backdrop for focus
                zIndex: (theme) => theme.zIndex.modal + 1,
                flexDirection: 'column',
            }}
            open={open}
        >
            <Lottie
                style={{ width: "15%", paddingLeft: "3px" }}
                animationData={uploadingAnimation}
                loop
            />
            <LinearProgressWithLabel value={progress} />
        </Backdrop>
    );
};

LoadingOverlay.propTypes = {
    open: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
};

export default LoadingOverlay;
