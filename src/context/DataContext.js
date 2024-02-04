import React, {
    createContext,
} from "react";

export const DataContext = createContext({});

export const DataContextProvider = (props) => {

    const DataContextValue = {
    }

    return (
        <DataContext.Provider value={DataContextValue}>
            {props.children}
        </DataContext.Provider>
    );
}