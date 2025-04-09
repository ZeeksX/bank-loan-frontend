import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(localStorage.getItem("access_token"));
    });

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
            return null;
        }
    });

    const getTokenExpiryTime = (token) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.exp * 1000;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const refreshToken = async () => {
        const refresh_token = localStorage.getItem("refresh_token");
        const storedUser = localStorage.getItem("user");

        if (!refresh_token || !storedUser) {
            logout();
            return false;
        }

        try {
            const response = await fetch("http://localhost:8000/api/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refresh_token }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                setupTokenRefresh(data.access_token);
                return true;
            }

            logout();
            return false;

        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
            return false;
        }
    };

    const setupTokenRefresh = (accessToken) => {
        const expiryTime = getTokenExpiryTime(accessToken);
        if (!expiryTime) return;

        const currentTime = Date.now();
        const timeUntilRefresh = Math.max(0, expiryTime - currentTime - 300000);

        if (window.refreshTimer) clearTimeout(window.refreshTimer);

        window.refreshTimer = setTimeout(() => {
            refreshToken().catch(error =>
                console.error("Auto refresh failed:", error)
            );
        }, timeUntilRefresh);
    };

    useEffect(() => {
        const validateAuthState = () => {
            const accessToken = localStorage.getItem("access_token");
            const storedUser = localStorage.getItem("user");

            if (!accessToken || !storedUser) {
                logout();
                return;
            }

            try {
                JSON.parse(storedUser);
                setIsAuthenticated(true);
                setupTokenRefresh(accessToken);
            } catch (error) {
                console.error("Invalid user data:", error);
                logout();
            }
        };

        validateAuthState();

        return () => {
            if (window.refreshTimer) clearTimeout(window.refreshTimer);
        };
    }, []);

    const login = (userData) => {
        if (!userData?.access_token || !userData?.refresh_token) {
            console.error("Invalid login data");
            return;
        }

        try {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("access_token", userData.access_token);
            localStorage.setItem("refresh_token", userData.refresh_token);

            setUser(userInfo);
            setIsAuthenticated(true);
            setupTokenRefresh(userData.access_token);

        } catch (error) {
            console.error("Login failed:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setIsAuthenticated(false);
        if (window.refreshTimer) clearTimeout(window.refreshTimer);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            refreshToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);