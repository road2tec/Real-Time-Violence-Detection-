import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, logout as authLogout } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

    const loginUser = (token) => {
        setIsAuthenticated(true);
    };

    const logoutUser = () => {
        authLogout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
