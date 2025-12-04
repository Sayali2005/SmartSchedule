// Validation utilities for SmartSchedule

// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Phone validation (basic)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone && phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Check if string is not empty
export const isNotEmpty = (value) => {
    return value && value.trim().length > 0;
};

// Validate instructor data
export const validateInstructor = (instructor) => {
    const errors = {};

    if (!isNotEmpty(instructor.name)) {
        errors.name = 'Name is required';
    }

    if (!isValidEmail(instructor.email)) {
        errors.email = 'Valid email is required';
    }

    if (!isValidPassword(instructor.password)) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (instructor.phone && !isValidPhone(instructor.phone)) {
        errors.phone = 'Valid phone number is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Validate course data
export const validateCourse = (course) => {
    const errors = {};

    if (!isNotEmpty(course.name)) {
        errors.name = 'Course name is required';
    }

    if (!isNotEmpty(course.level)) {
        errors.level = 'Course level is required';
    }

    if (!isNotEmpty(course.description)) {
        errors.description = 'Course description is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Validate lecture data
export const validateLecture = (lecture) => {
    const errors = {};

    if (!lecture.courseId) {
        errors.courseId = 'Course is required';
    }

    if (!lecture.instructorId) {
        errors.instructorId = 'Instructor is required';
    }

    if (!lecture.date) {
        errors.date = 'Date is required';
    }

    if (!lecture.startTime) {
        errors.startTime = 'Start time is required';
    }

    if (!lecture.endTime) {
        errors.endTime = 'End time is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
