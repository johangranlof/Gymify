import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.jti[1];
            setUserId(userIdFromToken);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.jti[1];
        setUserId(userIdFromToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};