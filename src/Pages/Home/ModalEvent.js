import poster from "../../assets/images/poster.jpeg";

import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

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
    p: 4,
    outline: 'none',
    maxWidth: '700px',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    flexWrap: 'wrap',
    // backgroundImage: `url(${modalBackground2})`,
    backgroundSize: "cover"
};

const posterStyle = {
    width: '250px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '1px solid #EBBC64'
};

const ModalEvent = ({ open, handleClose }) => {
    const [tickKey, setTickKey] = useState(0);

    const targetDate = new Date('Nov 01, 2025 00:00:00');

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate - now;
        let timeLeft = {};

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const months = Math.floor(days / 30); // Rough estimate: 1 month ≈ 30 days
            const remainingDays = days % 30;

            timeLeft = {
                months: months,
                days: remainingDays,
                totalDays: days,
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };


    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
            setTickKey(prev => prev + 1); // Force re-trigger animation
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
                    src={poster}
                    alt="Event Poster"
                    style={posterStyle}
                />

                {/* Text + Countdown Section */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        className="creamText"
                        id="modal-modal-title"
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                    >
                        The Sound of Asia
                    </Typography>

                    <div style={{ height: '3px', backgroundColor: '#EBBC64', width: '60px', margin: '12px 0' }} />

                    <Typography sx={{ color: '#ccc', mb: 2 }}>
                        This is the biggest APCS competition ever, bringing musicians from around the world to gather and perform at the heart of Asia.
                    </Typography>

                    <Typography className="creamText" variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                        Registration Closed: Nov 01, 2025
                    </Typography>

                    {timeLeft.totalDays >= 30 ? (
                        <Box
                            sx={{
                                fontFamily: 'monospace',
                                color: '#fff',
                                background: '#2A2A2A',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                maxWidth: '400px',
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '20px' }}>
                                {timeLeft.months > 0 && `${timeLeft.months} ${timeLeft.months === 1 ? 'month' : 'months'}`}
                                {timeLeft.months > 0 && timeLeft.days > 0 && ' and '}
                                {timeLeft.days > 0 && `${timeLeft.days} ${timeLeft.days === 1 ? 'day' : 'days'}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#aaa', fontSize: '16px', mt: 1 }}>
                                {timeLeft.totalDays} days {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                fontFamily: 'monospace',
                                fontSize: '18px',
                                color: '#fff',
                                background: '#2A2A2A',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                justifyContent: 'space-between',
                                maxWidth: '400px',
                                mb: 2
                            }}
                        >
                            <span>{timeLeft.days}d</span>
                            <span>{timeLeft.hours}h</span>
                            <span>{timeLeft.minutes}m</span>
                            <span key={tickKey} className="tick-animation">{timeLeft.seconds}s</span>
                        </Box>
                    )}



                    <a
                        href="https://api.whatsapp.com/send/?phone=6282213002686"
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
