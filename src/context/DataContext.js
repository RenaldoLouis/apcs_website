import { signInWithPopup } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FirebaseApi from '../middleware/firebaseApi';
import { YearlyEvent } from '../constant/YearlyEvent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const DataContext = createContext();

export const useAuth = () => useContext(DataContext);

export const DataContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallMobileAndSmaller = useMediaQuery(theme.breakpoints.down('sm')); // 600
    const isMobileAndSmaller = useMediaQuery(theme.breakpoints.down('md'));// 900
    const isMobileAndBigger = useMediaQuery(theme.breakpoints.up('md'));

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageHomeLoaded, setImageHomeLoaded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(YearlyEvent.TURNINGPOINT);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setUser({ ...user, token });
                // navigate("/adminDashboard");
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        // const tokenResult = await result.user.getIdTokenResult();
        const userEmail = await result.user.email;
        const whitelistDatas = await FirebaseApi.getWhitelist();
        let allowed = false;
        whitelistDatas.forEach((eachData) => {
            if (eachData.id === userEmail) {
                allowed = true
            }
        })
        if (allowed) {
            setUser({ ...result.user, token });
            navigate("/adminDashboard");
        } else {
            toast.error("Account Is Not Allowed");
            signOut(true);
        }
    };

    const signOut = async (withoutToast = false) => {
        try {
            await auth.signOut();
            setUser(null);
            if (!withoutToast) {
                toast.success("Succesfully Sign Out")
            }
        } catch (e) {
            toast.error("Sign Out Failed");
        }
    };

    return (
        <DataContext.Provider value={{ user, signInWithGoogle, signOut, loading, setImageHomeLoaded, imageHomeLoaded, setSelectedEvent, selectedEvent, isMobileAndSmaller, isMobileAndBigger, isSmallMobileAndSmaller }}>
            {!loading && children}
        </DataContext.Provider>
    );
};
