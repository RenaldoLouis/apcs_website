import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import modalBackground2 from "../../assets/images/modal_background2.png";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1E1E1E',
    color: '#fff',
    border: `2px solid #EBBC64`,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    borderRadius: '16px',
    p: 4,
    outline: 'none',
    maxWidth: '700px',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    flexWrap: 'wrap',
    backgroundImage: `url(${modalBackground2})`,
    backgroundSize: "cover"
};

const posterStyle = {
    width: '250px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '2px solid #EBBC64'
};

const ModalEvent = ({ open, handleClose }) => {
    const targetDate = new Date('April 7, 2025 00:00:00');

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate - now;
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                {/* Poster Image */}
                <img
                    src="/your-poster-image.jpg" // Replace with your actual path
                    alt="Event Poster"
                    style={posterStyle}
                />

                {/* Text + Countdown Section */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        id="modal-modal-title"
                        variant="h5"
                        sx={{ color: '#EBBC64', fontWeight: 700 }}
                    >
                        A Prestigious Global Concert
                    </Typography>

                    <div style={{ height: '3px', backgroundColor: '#EBBC64', width: '60px', margin: '12px 0' }} />

                    <Typography sx={{ color: '#ccc', mb: 2 }}>
                        Showcase your talent to the world for a chance to perform at the center of the orchestra.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ color: '#EBBC64', fontWeight: 500, mb: 1 }}>
                        Countdown to April 7, 2025:
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        color: '#fff',
                        background: '#2A2A2A',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        justifyContent: 'space-between',
                        maxWidth: '300px',
                        mb: 2
                    }}>
                        <span>{timeLeft.days}d</span>
                        <span>{timeLeft.hours}h</span>
                        <span>{timeLeft.minutes}m</span>
                        <span>{timeLeft.seconds}s</span>
                    </Box>

                    {/* Optional CTA Button */}
                    {/* You can style it further with MUI Button */}
                    <a
                        href="/register"
                        style={{
                            backgroundColor: '#EBBC64',
                            color: '#1E1E1E',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-block'
                        }}
                    >
                        Register Now
                    </a>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalEvent;
