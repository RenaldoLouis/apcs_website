import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { YearlyEvent } from '../constant/YearlyEvent';
import { auth, db, provider } from '../firebase';
import FirebaseApi from '../middleware/firebaseApi';

const DataContext = createContext();

export const useAuth = () => useContext(DataContext);

export const DataContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallMobileAndSmaller = useMediaQuery(theme.breakpoints.down('sm')); // 600
    const isMobileAndSmaller = useMediaQuery(theme.breakpoints.down('md'));// 900
    const isMobileAndBigger = useMediaQuery(theme.breakpoints.up('md'));
    const isLaptopAndSmaller = useMediaQuery(theme.breakpoints.down('lg'));

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageHomeLoaded, setImageHomeLoaded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(YearlyEvent.CLASSICALFESTIVALJKT2024);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setLoggedInUser({ ...user, token });
            } else {
                setLoggedInUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            // 1. Popup Signin
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // 2. Check if user exists in Firestore 'users' collection
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userRole = null;

            if (userDocSnap.exists()) {
                // CASE A: User already exists in DB, get their role
                const userData = userDocSnap.data();
                userRole = userData.role;
            } else {
                // CASE B: User is new. Check whitelist to see if they are allowed.
                // Note: This relies on your existing FirebaseApi.getWhitelist() logic
                const whitelistDatas = await FirebaseApi.getWhitelist();
                const isWhitelisted = whitelistDatas.some(data => data.id === user.email);

                if (isWhitelisted) {
                    // Create the user in DB with a role
                    userRole = "admin"; // Or derive from whitelist if you store roles there
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: userRole,
                        createdAt: new Date()
                    });
                }
            }

            // 3. Final Access Check
            if (userRole) {
                // Get token
                const token = await user.getIdToken();

                // Save user AND role to state
                setLoggedInUser({ ...user, token, role: userRole });

                // Navigate based on role (optional)
                if (userRole === 'admin') {
                    navigate("/adminDashboard");
                } else {
                    navigate("/userDashboard");
                }
            } else {
                // User not in DB and not in whitelist
                toast.error("Account is not authorized.");
                await signOut(auth);
            }

        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Login Failed");
        }
    };

    const signOut = async (withoutToast = false) => {
        try {
            await auth.signOut();
            setLoggedInUser(null);
            if (!withoutToast) {
                toast.success("Succesfully Sign Out")
            }
        } catch (e) {
            toast.error("Sign Out Failed");
        }
    };

    const DataContextValue = {
        loggedInUser,
        signInWithGoogle,
        signOut,
        loading,
        setImageHomeLoaded,
        imageHomeLoaded,
        setSelectedEvent,
        selectedEvent,
        isMobileAndSmaller,
        isMobileAndBigger,
        isSmallMobileAndSmaller,
        isLaptopAndSmaller
    }

    return (
        <DataContext.Provider value={DataContextValue}>
            {!loading && children}
        </DataContext.Provider>
    );
};
