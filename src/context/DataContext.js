import React, {
    createContext,
    useState,
} from "react";

export const DataContext = createContext({});

export const DataContextProvider = (props) => {

    const [loggedInAdmin, setLoggedInAdmin] = useState(null)

    const DataContextValue = {
        setLoggedInAdmin,
        loggedInAdmin
    }

    return (
        <DataContext.Provider value={DataContextValue}>
            {props.children}
        </DataContext.Provider>
    );
}