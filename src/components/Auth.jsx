import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("access_token"); // Check if token exists
    });

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing stored user", error);
            return null;
        }
    });

    // Function to check if the current user is an admin
    const isAdmin = () => {
        if (!user) return false;
        const adminRoles = ['admin', 'loan_officer', 'manager'];
        return adminRoles.includes(user.role) || user.is_admin === true;
    };

    // Function to decode JWT token and extract expiration time
    const getTokenExpiryTime = (token) => {
        if (!token) return null;
        try {
            // JWT tokens are split into three parts by dots
            const payload = token.split('.')[1];
            // The middle part needs to be base64 decoded
            const decodedPayload = JSON.parse(atob(payload));
            // exp is the expiration time in seconds
            return decodedPayload.exp * 1000; // Convert to milliseconds
        } catch (error) {
            console.error("Error decoding token", error);
            return null;
        }
    };

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
        const refresh_token = localStorage.getItem("refresh_token");

        if (!refresh_token) {
            logout();
            return false;
        }

        try {
            const response = await fetch("http://localhost:8000/api/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ refresh: refresh_token }),
            });
            const data = await response.json();
            if (response.ok && data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                setupTokenRefresh(data.access_token);
                return true;
            } else {
                console.error("Failed to refresh token", data);
                logout();
                return false;
            }
        } catch (error) {
            console.error("Error refreshing token", error);
            logout();
            return false;
        }
    };

    // Setup token refresh timer based on expiration time
    const setupTokenRefresh = (accessToken) => {
        const expiryTime = getTokenExpiryTime(accessToken);
        if (!expiryTime) return;

        // Calculate time until 5 minutes before expiry
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        const timeUntilRefresh = Math.max(0, timeUntilExpiry - (5 * 60 * 1000));

        // Clear any existing timer
        if (window.refreshTimer) {
            clearTimeout(window.refreshTimer);
        }

        // Set up the new timer
        window.refreshTimer = setTimeout(() => {
            refreshToken();
        }, timeUntilRefresh);

        // Also set up a timer to log remaining time every minute
        if (window.refreshLogTimer) {
            clearInterval(window.refreshLogTimer);
        }

        window.refreshLogTimer = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = expiryTime - currentTime - (5 * 60 * 1000);

            if (remainingTime <= 0) {
                clearInterval(window.refreshLogTimer);
                return;
            }
        }, 60000);
    };

    // Update authentication state on mount and set up token refresh
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const storedUser = localStorage.getItem("user");

            if (accessToken && storedUser) {
                setIsAuthenticated(true);
                setUser(JSON.parse(storedUser));
                setupTokenRefresh(accessToken);
            } else {
                // If token or user is missing, reset auth state
                setIsAuthenticated(false);
                setUser(null);
                logout();
            }
        } catch (error) {
            console.error("Error in auth initialization", error);
            logout();
        }

        return () => {
            if (window.refreshTimer) {
                clearTimeout(window.refreshTimer);
            }
            if (window.refreshLogTimer) {
                clearInterval(window.refreshLogTimer);
            }
        };
    }, []);

    const login = (userData) => {
        if (!userData || !userData.access || !userData.refresh) {
            console.error("Invalid user data for login");
            return;
        }

        try {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("access_token", userData.access);
            localStorage.setItem("refresh_token", userData.refresh);

            setUser(userData);
            setIsAuthenticated(true);
            setupTokenRefresh(userData.access);
        } catch (error) {
            console.error("Error during login", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setUser(null);
        setIsAuthenticated(false);

        if (window.refreshTimer) {
            clearTimeout(window.refreshTimer);
        }
        if (window.refreshLogTimer) {
            clearInterval(window.refreshLogTimer);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isAdmin, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};