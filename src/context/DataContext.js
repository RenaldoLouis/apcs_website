import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { auth, provider } from '../firebase';
import { CookieKeys } from '../constant/CookieKeys';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DataContext = createContext();

export const useAuth = () => useContext(DataContext);

export const DataContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);

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
    }, [navigate]);

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        setUser({ ...result.user, token });
        navigate("/adminDashboard");
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            setUser(null);
            toast.success("Succesfully Sign Out")
        } catch (e) {
            toast.error("Sign Out Failed");
        }
    };

    return (
        <DataContext.Provider value={{ user, signInWithGoogle, signOut, loading }}>
            {!loading && children}
        </DataContext.Provider>
    );
};
