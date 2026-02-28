// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("graphify_token") || "");
    const [loading, setLoading] = useState(true);

    // On mount, verify token and fetch user
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Invalid token");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                // Token expired or invalid
                setToken("");
                setUser(null);
                localStorage.removeItem("graphify_token");
            })
            .finally(() => setLoading(false));
    }, [token]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("graphify_token", jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("graphify_token");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
