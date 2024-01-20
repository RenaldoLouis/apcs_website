import React, {
    useState,
    createContext,
    useEffect
} from "react";

export const DataContext = createContext({});
let PWAData;
export const DataContextProvider = (props) => {

    const [supportsPWA, setSupportsPWA] = useState(false);
    const [showInstallMessage, setShowInstallMessage] = useState(false);

    const getPWADisplayMode = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (document.referrer.startsWith('android-app://')) {
            return 'twa';
        } else if (navigator.standalone || isStandalone) {
            return 'standalone';
        }
        return 'browser';
    }

    useEffect(() => {
        // Detects if device is on iOS 
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        }
        // Detects if device is in standalone mode
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

        window.addEventListener("appinstalled", () => {
            setSupportsPWA(false);
        });

        if (getPWADisplayMode() !== "browser") {
            setSupportsPWA(false);
        }

        if (isInStandaloneMode()) {
            setSupportsPWA(false);
        }

        // Checks if should display install popup notification:
        if (isIos() && !isInStandaloneMode()) {
            setSupportsPWA(false);
            setShowInstallMessage(true);
        }
    }, [supportsPWA])

    useEffect(() => {
        const handler = e => {
            setSupportsPWA(true);
            PWAData = e;
        };
        window.addEventListener("beforeinstallprompt", handler);
        setTimeout(() => {
            let event = new Event('beforeinstallprompt', handler);
            window.dispatchEvent(event)
        }, 1);

        return () => window.removeEventListener("transitionend", handler);
    }, []);

    const downloadApp = evt => {
        evt.preventDefault();
        PWAData.prompt()
        PWAData.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                PWAData = null;
            }
        })
    };

    const DataContextValue = {
        PWAData,
        showInstallMessage,
        supportsPWA,
        downloadApp
    }

    return (
        <DataContext.Provider value={DataContextValue}>
            {props.children}
        </DataContext.Provider>
    );
}