import React, { createContext, useContext, useState } from 'react';


const DrawerStatusContext = createContext();


export const DrawerStatusProvider = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <DrawerStatusContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer }}>
            {children}
        </DrawerStatusContext.Provider>
    );
};


export const useDrawerStatus = () => {
    return useContext(DrawerStatusContext);
};
