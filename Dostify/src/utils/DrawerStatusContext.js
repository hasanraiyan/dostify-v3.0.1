import React, { createContext, useContext, useState } from 'react';

// Create the Drawer Status Context
const DrawerStatusContext = createContext();

// Create a Provider component
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

// Custom hook to use the Drawer Status Context
export const useDrawerStatus = () => {
    return useContext(DrawerStatusContext);
};
