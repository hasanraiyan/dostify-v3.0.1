import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { config } from "../constants/constant";
import { STORAGE_KEYS } from "../constants/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        const loadToken = async () => {
            console.log("Attempting to log out...");
            try {
                const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.USERTOKEN);
                if (storedToken) {
                    setToken(storedToken);
                    setIsLoggedIn(true);

                    console.log("User auto-signed in with existing token");
                }
            } catch (error) {
                console.error("Error loading token:", error);
            }
        };

        loadToken();
    }, []);


    const handleRequest = async (apiCall) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };


    const register = async (username, email, password) => {
        return handleRequest(() =>
            axios.post(`${config.BACKEND_SERVER_URL}/auth/register`, { username, email, password, name })
        );
    };


    const verifyEmail = async (token) => {
        return handleRequest(() =>
            axios.post(`${config.BACKEND_SERVER_URL}/auth/verify-email/${token}`)
        );
    };


    const login = async (email, password) => {
        const data = await handleRequest(() =>
            axios.post(`${config.BACKEND_SERVER_URL}/auth/login`, { email, password })
        );

        try {
            await AsyncStorage.setItem(STORAGE_KEYS.USERTOKEN, data.token);
            setToken(data.token);
            setIsLoggedIn(true);
            setUser(data.user);

            console.log("User logged in:", data.user);
            return data;
        } catch (error) {
            console.error("Error storing user token in AsyncStorage:", error);
            throw error;
        }
    };


    const forgotPassword = async (email) => {
        return handleRequest(() =>
            axios.post(`${config.BACKEND_SERVER_URL}/auth/forgot-password`, { email })
        );
    };


    const resetPassword = async (token, newPassword) => {
        return handleRequest(() =>
            axios.post(`${config.BACKEND_SERVER_URL}/auth/reset-password/${token}`, { newPassword })
        );
    };


    const logout = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USERTOKEN);
            setIsLoggedIn(false);
            setToken(null);
            setUser(null);
            console.log("Token removed successfully");
        } catch (error) {
            console.error("Error removing user token:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ loading, error, user, token, isLoggedIn, register, verifyEmail, login, forgotPassword, resetPassword, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuthContext = () => {
    return useContext(AuthContext);
};
