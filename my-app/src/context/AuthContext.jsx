// Authentication Context for SmartSchedule
import { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { getFromStorage, setToStorage, removeFromStorage } from '../utils/storage';

const AuthContext = createContext(null);

// Admin credentials (hardcoded)
const ADMIN_CREDENTIALS = {
    email: 'admin@smart.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const user = getFromStorage(STORAGE_KEYS.CURRENT_USER);
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (email, password, instructors = []) => {
        // Check if admin
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const adminUser = {
                ...ADMIN_CREDENTIALS,
                id: 'admin',
            };
            setCurrentUser(adminUser);
            setToStorage(STORAGE_KEYS.CURRENT_USER, adminUser);
            return { success: true, user: adminUser };
        }

        // Check if instructor
        const instructor = instructors.find(
            (inst) => inst.email === email && inst.password === password
        );

        if (instructor) {
            const instructorUser = {
                id: instructor.id,
                email: instructor.email,
                name: instructor.name,
                role: 'instructor',
                avatar: instructor.avatar,
            };
            setCurrentUser(instructorUser);
            setToStorage(STORAGE_KEYS.CURRENT_USER, instructorUser);
            return { success: true, user: instructorUser };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        removeFromStorage(STORAGE_KEYS.CURRENT_USER);
    };

    // Check if user is admin
    const isAdmin = () => {
        return currentUser?.role === 'admin';
    };

    // Check if user is instructor
    const isInstructor = () => {
        return currentUser?.role === 'instructor';
    };

    const value = {
        currentUser,
        login,
        logout,
        isAdmin,
        isInstructor,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
