import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 460,
    bgcolor: '#1E1E1E', // dark elegant background
    color: '#fff', // ensure text pops
    border: `2px solid #EBBC64`,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    borderRadius: '16px',
    p: 4,
    outline: 'none',
};

const ModalEvent = ({ open, handleClose }) => {
    // Set your target date
    const targetDate = new Date('April 7, 2025 00:00:00');

    // Function to calculate the time left
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
            // Countdown has reached or passed the target date
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    // State to hold the countdown values
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // Update the timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clean up the interval on component unmount
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
                <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                    sx={{ color: '#EBBC64', fontWeight: 600, mb: 1 }}
                >
                    Welcome to the Orchestra
                </Typography>
                <div style={{ height: '4px', backgroundColor: '#EBBC64', width: '50px', margin: '12px 0' }} />

                <Typography
                    id="modal-modal-description"
                    sx={{ color: '#ddd', lineHeight: 1.6 }}
                >
                    Enjoy a curated journey of musical storytelling. Let the symphony begin.
                </Typography>
                <div>
                    <Typography
                        id="modal-modal-description"
                        sx={{ color: '#ddd', lineHeight: 1.6 }}
                    >
                        Countdown to April 7, 2025                    </Typography>
                    <div>
                        {timeLeft.days} Days {timeLeft.hours} Hours {timeLeft.minutes} Minutes {timeLeft.seconds} Seconds
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default ModalEvent;