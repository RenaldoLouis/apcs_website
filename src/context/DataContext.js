import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { YearlyEvent } from '../constant/YearlyEvent';
import { auth, db, provider } from '../firebase';
import FirebaseApi from '../middleware/firebaseApi';

const DataContext = createContext();
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 Hour in milliseconds

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
            const sessionStart = localStorage.getItem("sessionStart");

            // Helper function to handle logout
            const forceLogout = async () => {
                await signOut(auth);
                localStorage.removeItem("sessionStart");
                setLoggedInUser(null);
                navigate("/login");
                toast.info("Session expired. Please log in again.");
            };

            if (user && sessionStart) {
                const now = Date.now();
                const timeElapsed = now - parseInt(sessionStart, 10);

                // CHECK 1: Has the session already expired?
                if (timeElapsed > SESSION_DURATION_MS) {
                    console.log("Session expired on load");
                    await forceLogout();
                    setLoading(false);
                    return; // Stop execution here
                }

                // CHECK 2: If valid, set a timer to auto-logout when the hour ends
                const timeRemaining = SESSION_DURATION_MS - timeElapsed;
                console.log(`Session valid. Auto-logout in ${Math.round(timeRemaining / 60000)} minutes.`);

                // const autoLogoutTimer = setTimeout(() => {
                //     console.log("Time limit reached. Logging out...");
                //     forceLogout();
                // }, timeRemaining);

                try {
                    // --- Your Existing Logic ---
                    const token = await user.getIdToken();
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let firestoreData = {};
                    if (userDocSnap.exists()) {
                        firestoreData = userDocSnap.data();
                    }

                    setLoggedInUser({
                        ...user,
                        token,
                        ...firestoreData
                    });

                    const userRole = firestoreData.role;

                    // Only navigate if we are currently on the login page
                    // (Prevents redirection loops if user is already on a dashboard)
                    if (window.location.pathname === '/login') {
                        if (userRole === 'admin' || userRole === 'subadmin') {
                            navigate("/adminDashboard");
                        } else if (userRole === 'jury') {
                            navigate("/juryDashboard");
                        } else {
                            navigate("/login");
                        }
                    }

                } catch (error) {
                    console.error("Error fetching user details:", error);
                    setLoggedInUser(null);
                }

                // Clean up the timer if the component unmounts or auth state changes
                // return () => clearTimeout(autoLogoutTimer);

            }
            // else if (user && !sessionStart) {
            //     // Edge case: User is logged in but has no timestamp (e.g. from before this update)
            //     // Either force logout OR set a new timestamp. For security, usually force logout.
            //     await forceLogout();
            // }
            else {
                // No user found
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

            // 2. Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userRole = null;

            if (userDocSnap.exists()) {
                userRole = userDocSnap.data().role;
            } else {
                const whitelistDatas = await FirebaseApi.getWhitelist();
                const isWhitelisted = whitelistDatas.some(data => data.id === user.email);

                if (isWhitelisted) {
                    userRole = "admin";
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: userRole,
                        createdAt: new Date()
                    });
                }
            }

            // 3. Final Access Check
            if (userRole) {
                localStorage.setItem("sessionStart", Date.now().toString());
                // ---------------------------------------

                const token = await user.getIdToken();
                setLoggedInUser({ ...user, token, role: userRole });

                if (userRole === 'admin' || userRole === 'subadmin') {
                    navigate("/adminDashboard");
                }
            } else {
                toast.error("Account is not authorized.");
                await signOut(auth);
            }

        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Login Failed");
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            // 1. Authenticate with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Check if user exists in Firestore 'users' collection
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userData = null;
            let userRole = null;
            localStorage.setItem("sessionStart", Date.now().toString());

            if (userDocSnap.exists()) {
                // CASE A: User already exists in DB, get their role
                const userDataSnap = userDocSnap.data();
                userData = userDataSnap;
                userRole = userData?.role;
            }
            // else {
            //     // CASE B: New User -> Check Whitelist
            //     const whitelistDatas = await FirebaseApi.getWhitelist();
            //     const isWhitelisted = whitelistDatas.some(data => data.id === user.email);

            //     if (isWhitelisted) {
            //         userRole = "admin"; // Default role for whitelisted users
            //         await setDoc(userDocRef, {
            //             email: user.email,
            //             role: userRole,
            //             createdAt: new Date()
            //         });
            //     }
            // }

            // 3. Final Access Check & State Update
            if (userRole) {
                const token = await user.getIdToken();

                // This updates the global app state
                setLoggedInUser({
                    ...user,
                    ...userData,
                    token,
                    createdAt: userData.createdAt?.toDate()
                });

                // Navigation
                if (userRole === 'admin') {
                    navigate("/adminDashboard");
                } else {
                    // Handle other roles (e.g., jury)
                    navigate("/juryDashboard");
                }
            } else {
                toast.error("Account is not authorized.");
                await signOut(auth);
                setLoggedInUser(null);
            }

        } catch (error) {
            console.error("Email Login Error:", error);
            let msg = "Login failed.";
            if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
            throw new Error(msg); // Throw error so Login component can handle UI (loading state)
        }
    };

    const signOut = async (withoutToast = false) => {
        try {
            await auth.signOut();

            // --- NEW: Clear session timer ---
            localStorage.removeItem("sessionStart");
            // --------------------------------

            setLoggedInUser(null);
            if (!withoutToast) {
                toast.success("Successfully Sign Out");
            }
        } catch (e) {
            console.error("Sign out error", e);
            toast.error("Sign Out Failed");
        }
    };

    const DataContextValue = {
        loggedInUser,
        signInWithGoogle,
        signInWithEmail,
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
