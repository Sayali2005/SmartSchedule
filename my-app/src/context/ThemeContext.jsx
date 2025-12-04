// Theme Context for Dark Mode
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    // Load theme preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('smartschedule_theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        setIsDark((prev) => {
            const newTheme = !prev;
            if (newTheme) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('smartschedule_theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('smartschedule_theme', 'light');
            }
            return newTheme;
        });
    };

    const value = {
        isDark,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
