import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType } from '../types'; // Adjust path based on your folders

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refreshBalance = () => {
        const activeToken = token || localStorage.getItem('token');
        if (!activeToken) return;
        fetch('http://localhost:5047/api/wallets', {
      headers: { 'Authorization': `Bearer ${activeToken}`,
                'Content-Type': 'application/json' }
    })
      .then(res => {
      if (!res.ok) throw new Error("Sync failed");
      return res.json();
    })
      .then(data => setBalance(data.balance))
      .catch(err => console.error("Failed to sync wallet state:", err));
    };

    // 1. Unified LocalStorage key constants to eliminate typos
    const TOKEN_KEY = 'authToken';
    const USER_KEY = 'authUser';

    // Run immediately on boot to check if the user was already logged in
    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5047/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json(); // Expected response: { token, user }
            
            setToken(data.token);
            setUser(data.user);

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } catch (error) {
            console.error("Login failed:", error);
            throw error; 
        }
    };

    const register = async (email: string, password: string, fullName: string) => {
    try {
        const response = await fetch('http://localhost:5047/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName }),
        });

        // 1. If the response is a failure, handle text vs JSON dynamically
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Registration failed.";

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData || errorMessage;
            } else {
                // This captures the plain text "This email address is already registered."
                errorMessage = await response.text(); 
            }

            throw new Error(errorMessage);
        }

        // 2. If successful, parse the login token package payload
        const data = await response.json();

        setToken(data.token);
        setUser(data.user);

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
        console.error("Registration failed:", error);
        throw error; // Pass it along to Register.tsx to display in the UI banner
    }
};

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    // 2. Calculated state: Clean, derivation that stays perfectly in sync with the user state
    const isAuthenticated = !!user; 

    return (
        <AuthContext.Provider value={{ user, token, balance, isAuthenticated, login, register, logout, isLoading, refreshBalance }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used inside an AuthProvider wrapper');
    }
    return context;
};