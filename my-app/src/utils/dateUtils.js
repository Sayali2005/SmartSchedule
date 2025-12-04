// Date formatting and manipulation utilities
import { format, parseISO, isAfter, isBefore, isSameDay } from 'date-fns';

// Format date to readable string
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

// Format date with time
export const formatDateTime = (date) => {
    return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

// Check if date is in the past
export const isPastDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(dateObj, new Date());
};

// Check if date is in the future
export const isFutureDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isAfter(dateObj, new Date());
};

// Check if two dates are the same day
export const isSameDayCheck = (date1, date2) => {
    const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(dateObj1, dateObj2);
};

// Get date in YYYY-MM-DD format for input fields
export const getInputDateFormat = (date = new Date()) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
};

// Sort dates ascending
export const sortDatesAsc = (dates) => {
    return [...dates].sort((a, b) => new Date(a) - new Date(b));
};

// Sort dates descending
export const sortDatesDesc = (dates) => {
    return [...dates].sort((a, b) => new Date(b) - new Date(a));
};
