// Data Context for managing Instructors, Courses, and Lectures
import { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { getFromStorage, setToStorage, initializeStorage } from '../utils/storage';
import { checkInstructorConflict, checkTimeSlotOverlap } from '../utils/conflictDetection';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize data on mount
    useEffect(() => {
        initializeStorage();
        loadData();
    }, []);

    // Load all data from localStorage
    const loadData = () => {
        const loadedInstructors = getFromStorage(STORAGE_KEYS.INSTRUCTORS) || [];
        const loadedCourses = getFromStorage(STORAGE_KEYS.COURSES) || [];
        const loadedLectures = getFromStorage(STORAGE_KEYS.LECTURES) || [];

        setInstructors(loadedInstructors);
        setCourses(loadedCourses);
        setLectures(loadedLectures);
        setLoading(false);
    };

    // Instructor CRUD operations
    const addInstructor = (instructor) => {
        const newInstructor = {
            ...instructor,
            id: Date.now().toString(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`,
        };
        const updated = [...instructors, newInstructor];
        setInstructors(updated);
        setToStorage(STORAGE_KEYS.INSTRUCTORS, updated);
        return newInstructor;
    };

    const updateInstructor = (id, updates) => {
        const updated = instructors.map((inst) =>
            inst.id === id ? { ...inst, ...updates } : inst
        );
        setInstructors(updated);
        setToStorage(STORAGE_KEYS.INSTRUCTORS, updated);
    };

    const deleteInstructor = (id) => {
        const updated = instructors.filter((inst) => inst.id !== id);
        setInstructors(updated);
        setToStorage(STORAGE_KEYS.INSTRUCTORS, updated);
    };

    const getInstructorById = (id) => {
        return instructors.find((inst) => inst.id === id);
    };

    // Course CRUD operations
    const addCourse = (course) => {
        const newCourse = {
            ...course,
            id: Date.now().toString(),
        };
        const updated = [...courses, newCourse];
        setCourses(updated);
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return newCourse;
    };

    const updateCourse = (id, updates) => {
        const updated = courses.map((course) =>
            course.id === id ? { ...course, ...updates } : course
        );
        setCourses(updated);
        setToStorage(STORAGE_KEYS.COURSES, updated);
    };

    const deleteCourse = (id) => {
        const updated = courses.filter((course) => course.id !== id);
        setCourses(updated);
        setToStorage(STORAGE_KEYS.COURSES, updated);
    };

    const getCourseById = (id) => {
        return courses.find((course) => course.id === id);
    };

    // Lecture CRUD operations
    const addLecture = (lecture) => {
        // Check for conflicts before adding
        const conflict = checkInstructorConflict(
            lecture.instructorId,
            lecture.date,
            lectures
        );

        if (conflict.hasConflict) {
            return {
                success: false,
                error: 'Instructor already has a lecture scheduled on this date',
                conflict: conflict.conflictingLecture,
            };
        }

        // Check for time slot overlap
        const overlap = checkTimeSlotOverlap(
            lecture.instructorId,
            lecture.date,
            lecture.startTime,
            lecture.endTime,
            lectures
        );

        if (overlap.hasOverlap) {
            return {
                success: false,
                error: 'Time slot overlaps with an existing lecture',
                conflict: overlap.overlappingLecture,
            };
        }

        const newLecture = {
            ...lecture,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        const updated = [...lectures, newLecture];
        setLectures(updated);
        setToStorage(STORAGE_KEYS.LECTURES, updated);
        return { success: true, lecture: newLecture };
    };

    const updateLecture = (id, updates) => {
        // Check for conflicts if date or instructor changed
        if (updates.instructorId || updates.date || updates.startTime || updates.endTime) {
            const existingLecture = lectures.find((lec) => lec.id === id);
            const updatedLecture = { ...existingLecture, ...updates };

            const conflict = checkInstructorConflict(
                updatedLecture.instructorId,
                updatedLecture.date,
                lectures,
                id // Exclude current lecture from conflict check
            );

            if (conflict.hasConflict) {
                return {
                    success: false,
                    error: 'Instructor already has a lecture scheduled on this date',
                };
            }

            const overlap = checkTimeSlotOverlap(
                updatedLecture.instructorId,
                updatedLecture.date,
                updatedLecture.startTime,
                updatedLecture.endTime,
                lectures,
                id
            );

            if (overlap.hasOverlap) {
                return {
                    success: false,
                    error: 'Time slot overlaps with an existing lecture',
                };
            }
        }

        const updated = lectures.map((lec) =>
            lec.id === id ? { ...lec, ...updates } : lec
        );
        setLectures(updated);
        setToStorage(STORAGE_KEYS.LECTURES, updated);
        return { success: true };
    };

    const deleteLecture = (id) => {
        const updated = lectures.filter((lec) => lec.id !== id);
        setLectures(updated);
        setToStorage(STORAGE_KEYS.LECTURES, updated);
    };

    const getLectureById = (id) => {
        return lectures.find((lec) => lec.id === id);
    };

    // Get lectures for a specific instructor
    const getInstructorLectures = (instructorId) => {
        return lectures.filter((lec) => lec.instructorId === instructorId);
    };

    // Get lectures for a specific course
    const getCourseLectures = (courseId) => {
        return lectures.filter((lec) => lec.courseId === courseId);
    };

    const value = {
        // State
        instructors,
        courses,
        lectures,
        loading,
        // Instructor methods
        addInstructor,
        updateInstructor,
        deleteInstructor,
        getInstructorById,
        // Course methods
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        // Lecture methods
        addLecture,
        updateLecture,
        deleteLecture,
        getLectureById,
        getInstructorLectures,
        getCourseLectures,
        // Utility
        loadData,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use data context
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export default DataContext;
