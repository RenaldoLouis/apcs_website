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
                try {
                    // 1. Get the Auth Token
                    const token = await user.getIdToken();

                    // 2. FETCH THE ROLE from Firestore using the user.uid
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let firestoreData = {};
                    if (userDocSnap.exists()) {
                        firestoreData = userDocSnap.data(); // This object contains { role: 'admin', ... }
                    }

                    // 3. Merge Auth data + Token + Firestore data (Role)
                    setLoggedInUser({
                        ...user,
                        token,
                        ...firestoreData // This adds the 'role' to your state object
                    });

                    const userRole = firestoreData.role
                    if (userRole === 'admin' || userRole === 'subadmin') {
                        navigate("/adminDashboard");
                    } else if (userRole === 'jury') {
                        // Handle other roles (e.g., jury)
                        navigate("/juryDashboard");
                    } else {
                        navigate("/login");
                    }

                } catch (error) {
                    console.error("Error fetching user details on refresh:", error);
                    setLoggedInUser(null);
                }
            } else {
                setLoggedInUser(null);
            }

            // 4. Stop loading ONLY after the Firestore fetch is complete
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
                if (userRole === 'admin' || userRole === 'subadmin') {
                    navigate("/adminDashboard");
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

            if (userDocSnap.exists()) {
                // CASE A: User already exists in DB, get their role
                const userDataSnap = userDocSnap.data();
                userData = userDataSnap;
                userRole = userData?.role;
            } else {
                // CASE B: New User -> Check Whitelist
                const whitelistDatas = await FirebaseApi.getWhitelist();
                const isWhitelisted = whitelistDatas.some(data => data.id === user.email);

                if (isWhitelisted) {
                    userRole = "admin"; // Default role for whitelisted users
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: userRole,
                        createdAt: new Date()
                    });
                }
            }

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
