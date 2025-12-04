// LocalStorage utility functions for SmartSchedule

const STORAGE_KEYS = {
    INSTRUCTORS: 'smartschedule_instructors',
    COURSES: 'smartschedule_courses',
    LECTURES: 'smartschedule_lectures',
    CURRENT_USER: 'smartschedule_current_user',
};

// Generic get function
export const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return null;
    }
};

// Generic set function
export const setToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
        return false;
    }
};

// Generic remove function
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
        return false;
    }
};

// Clear all app data
export const clearAllStorage = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
        removeFromStorage(key);
    });
};

// Initialize default data if not exists
export const initializeStorage = () => {
    // Initialize instructors with dummy data
    if (!getFromStorage(STORAGE_KEYS.INSTRUCTORS)) {
        const defaultInstructors = [
            {
                id: '1',
                name: 'Dr. Sarah Johnson',
                email: 'sarah@smart.com',
                password: 'sarah123',
                phone: '+1-555-0101',
                specialization: 'Computer Science',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            },
            {
                id: '2',
                name: 'Prof. Michael Chen',
                email: 'michael@smart.com',
                password: 'michael123',
                phone: '+1-555-0102',
                specialization: 'Mathematics',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            },
            {
                id: '3',
                name: 'Dr. Emily Davis',
                email: 'emily@smart.com',
                password: 'emily123',
                phone: '+1-555-0103',
                specialization: 'Physics',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
            },
        ];
        setToStorage(STORAGE_KEYS.INSTRUCTORS, defaultInstructors);
    }

    // Initialize courses with dummy data
    if (!getFromStorage(STORAGE_KEYS.COURSES)) {
        const defaultCourses = [
            {
                id: '1',
                name: 'Web Development Fundamentals',
                level: 'Beginner',
                description: 'Learn HTML, CSS, and JavaScript basics',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                duration: '12 weeks',
                color: '#2563EB',
            },
            {
                id: '2',
                name: 'Advanced React & Node.js',
                level: 'Advanced',
                description: 'Master full-stack development with React and Node.js',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                duration: '16 weeks',
                color: '#0EA5E9',
            },
            {
                id: '3',
                name: 'Data Structures & Algorithms',
                level: 'Intermediate',
                description: 'Essential DSA concepts for coding interviews',
                image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
                duration: '10 weeks',
                color: '#8B5CF6',
            },
        ];
        setToStorage(STORAGE_KEYS.COURSES, defaultCourses);
    }

    // Initialize lectures (empty by default)
    if (!getFromStorage(STORAGE_KEYS.LECTURES)) {
        setToStorage(STORAGE_KEYS.LECTURES, []);
    }
};

export default STORAGE_KEYS;
