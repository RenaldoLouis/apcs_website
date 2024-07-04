import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

const LandingPage = React.memo((props) => {
    const navigate = useNavigate();
    const { audio } = props

    const [isWelcomeExit, setIsWelcomeExit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [videoHome, setVideoHome] = useState("")

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                document.getElementById("welcomeText").classList.add('welcomeExit')
                setTimeout(() => {
                    // setIsWelcomeExit(true)
                    handleExplore()
                }, 5100);
            }, 5100);
        }
    }, [isLoading])

    useEffect(() => {
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
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    }, [])

    console.log(videoHome, "videoHome")

    const handleClickWelcome = () => {
        audio.play()

        document.getElementById("welcomeText").classList.add('welcomeExit')

        setTimeout(() => {
            setIsWelcomeExit(true)
        }, 2000);
    }

    const handleClickAPCS = () => {
        document.getElementById("apcsText").classList.add('welcomeExit')
        document.getElementById("buttonEntrance").classList.add('buttonExit')
    }

    const handleExplore = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.load();
        navigate("/home");
    }

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
                id="welcomeText"
                // ref={videoRef} 
                src={videoHome}
                // preload="none"
                muted={true}
                playsInline autoPlay className='video-container-home'></video>
        </article>
    )
});

export default LandingPage;