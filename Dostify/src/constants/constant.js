export const config = {
    BACKEND_SERVER_URL : "https://server-0xro.onrender.com",
    // BACKEND_SERVER_URL: "http://localhost:8000",
};

export const STORAGE_KEYS = {
    USERTOKEN: "userToken",
};
export const APP_INFO = {
    NAME: 'Dostify', // Replace with your actual app name if different
    // ... other app info you might need like VERSION, etc.
  };

import { Platform } from 'react-native';

export const COLORS = {
    primary: '#007AFF',
    primaryLight: '#EBF5FF',
    secondary: '#34C759',
    secondaryLight: '#E1F5EA',
    accent: '#AF52DE',
    accentLight: '#F6EDFC',
    success: '#34C759',
    successLight: '#E1F5EA',
    warning: '#FF9500',
    warningLight: '#FFF9E6',
    danger: '#FF3B30',
    dangerLight: '#FFEBEA',
    white: '#FFFFFF',
    black: '#000000',
    grey: '#8E8E93',
    lightGrey: '#F2F2F7',
    mediumGrey: '#E5E5EA',
    darkGrey: '#1C1C1E',
};

export const FONT_SIZES = {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 17,
    XLARGE: 20,
    XXLARGE: 28,
    HUGE: 34,
};

export const FONT_WEIGHT = Platform.select({
    ios: {
        REGULAR: '400',
        MEDIUM: '500',
        SEMIBOLD: '600',
        BOLD: '700',
    },
    android: {
        REGULAR: 'normal',
        MEDIUM: 'normal',
        SEMIBOLD: 'bold',   
        BOLD: 'bold',
    },
});

export const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'sans-serif';

export const SPACING = {
    XSMALL: 4,
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XLARGE: 24,
    XXLARGE: 32,
    XXXLARGE: 40,
};