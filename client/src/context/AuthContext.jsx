import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        // Fail-safe: Force loading to false after 8 seconds no matter what
        const failSafe = setTimeout(() => {
            if (loading) {
                console.warn("Auth check taking too long, forcing load...");
                setLoading(false);
            }
        }, 8000);

        const checkUser = async () => {
            console.log("Checking auth status...");
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me", {
                    withCredentials: true,
                    timeout: 7000
                });
                setUser(res.data);
                console.log("Auth success:", res.data?.name);
            } catch (error) {
                console.log("No active session or error", error.message);
                setUser(null);
            } finally {
                setLoading(false);
                clearTimeout(failSafe);
            }
        };
        checkUser();
        return () => clearTimeout(failSafe);
    }, []);

    const login = async (userData) => {
        const res = await axios.post("http://localhost:5000/api/auth/login", userData, {
            withCredentials: true
        });
        setUser(res.data);
    };

    const register = async (userData) => {
        const res = await axios.post("http://localhost:5000/api/auth/register", userData, {
            withCredentials: true
        });
        setUser(res.data);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
