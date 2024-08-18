import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { analytics, db } from '../../firebase';
import { useAuth } from "../../context/DataContext";
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { logEvent } from "firebase/analytics";

const CircularProgressWithLabel = (props) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};


const LandingPage = React.memo((props) => {
    const navigate = useNavigate();
    const { audio } = props
    const { imageHomeLoaded } = useAuth();
    const videoRef = useRef(null);


    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isWelcomeExit, setIsWelcomeExit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [videoHome, setVideoHome] = useState("")
    const [progress, setProgress] = React.useState(10);

    useEffect(() => {
        if (!isLoading && isVideoLoaded && imageHomeLoaded) {
            setTimeout(() => {
                // document.getElementById("welcomeText").classList.add('welcomeExit')
                setTimeout(() => {
                    // setIsWelcomeExit(true)
                    handleExplore()
                }, 500);
            }, 2000);
        }
    }, [isLoading, isVideoLoaded, imageHomeLoaded])

    useEffect(() => {
        logEvent(analytics, 'visit_landingPage');
        fetchPost()
    }, [])

    const fetchPost = useCallback(async () => {
        setIsLoading(true)
        const q = query(collection(db, "homeVideos"));

        await getDocs(q)
            .then((querySnapshot) => {
                if (querySnapshot) {
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setVideoHome(newData[0].video)
                    // setIsLoading(false)
                }
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    }, [])

    const handleExplore = () => {
        // audio.pause();
        // audio.currentTime = 0;
        // audio.load();

        navigate("/home");
    }

    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const percentLoaded = (video.buffered.end(0) / video.duration) * 100;
                setProgress(percentLoaded);
                if (percentLoaded === 100) {
                    setIsLoading(false);
                }
            }
        };

        video.addEventListener('progress', handleProgress);
        video.addEventListener('canplaythrough', () => setIsLoading(false));

        return () => {
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('canplaythrough', () => setIsLoading(false));
        };
    }, []);

    return (
        <article className="landingContiner" >
            {/* {!isWelcomeExit ? (
                <h2 id="welcomeText" className="welcomeEntrance"
                // onClick={() => handleClickWelcome()}
                >
                    Welcome
                </h2>
            ) : (
                <section>
                    <h2 id="apcsText" className="welcomeEntrance" onClick={() => handleClickAPCS()}>
                        APC Website
                    </h2>
                    <h2 id="buttonEntrance" className="buttonEntrance buttonStyle" onClick={() => handleExplore()} style={{ marginTop: 35 }}>
                        Explore
                    </h2>
                </section>
            )} */}
            <video
                onLoadedData={handleVideoLoaded}
                ref={videoRef}
                id="welcomeText"
                // ref={videoRef} 
                src={videoHome}
                // preload="none"
                muted={true}
                style={{ display: isVideoLoaded ? "" : "none" }}
                playsInline autoPlay className='video-container-home'></video>
            {!isVideoLoaded && (
                <CircularProgressWithLabel value={progress} />
            )}
        </article >
    )
});

export default LandingPage;