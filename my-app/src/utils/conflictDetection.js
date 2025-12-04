// Conflict detection utility for instructor scheduling

import { isSameDayCheck } from './dateUtils';

/**
 * Check if an instructor has a conflict on a specific date
 * @param {string} instructorId - The instructor's ID
 * @param {string} date - The date to check (YYYY-MM-DD format)
 * @param {Array} allLectures - Array of all lectures
 * @param {string} excludeLectureId - Optional lecture ID to exclude from check (for editing)
 * @returns {Object} - { hasConflict: boolean, conflictingLecture: Object|null }
 */
export const checkInstructorConflict = (instructorId, date, allLectures, excludeLectureId = null) => {
    // Filter lectures for this instructor on the same date
    const conflictingLecture = allLectures.find((lecture) => {
        // Skip if this is the lecture being edited
        if (excludeLectureId && lecture.id === excludeLectureId) {
            return false;
        }

        // Check if same instructor and same date
        return (
            lecture.instructorId === instructorId &&
            isSameDayCheck(lecture.date, date)
        );
    });

    return {
        hasConflict: !!conflictingLecture,
        conflictingLecture: conflictingLecture || null,
    };
};

/**
 * Get all lectures for a specific instructor
 * @param {string} instructorId - The instructor's ID
 * @param {Array} allLectures - Array of all lectures
 * @returns {Array} - Array of lectures for this instructor
 */
export const getInstructorLectures = (instructorId, allLectures) => {
    return allLectures.filter((lecture) => lecture.instructorId === instructorId);
};

/**
 * Get all lectures for a specific course
 * @param {string} courseId - The course's ID
 * @param {Array} allLectures - Array of all lectures
 * @returns {Array} - Array of lectures for this course
 */
export const getCourseLectures = (courseId, allLectures) => {
    return allLectures.filter((lecture) => lecture.courseId === courseId);
};

/**
 * Get lectures for a specific date
 * @param {string} date - The date to check (YYYY-MM-DD format)
 * @param {Array} allLectures - Array of all lectures
 * @returns {Array} - Array of lectures on this date
 */
export const getLecturesByDate = (date, allLectures) => {
    return allLectures.filter((lecture) => isSameDayCheck(lecture.date, date));
};

/**
 * Check if a time slot overlaps with existing lectures
 * @param {string} instructorId - The instructor's ID
 * @param {string} date - The date to check
 * @param {string} startTime - Start time (HH:MM format)
 * @param {string} endTime - End time (HH:MM format)
 * @param {Array} allLectures - Array of all lectures
 * @param {string} excludeLectureId - Optional lecture ID to exclude
 * @returns {Object} - { hasOverlap: boolean, overlappingLecture: Object|null }
 */
export const checkTimeSlotOverlap = (
    instructorId,
    date,
    startTime,
    endTime,
    allLectures,
    excludeLectureId = null
) => {
    const overlappingLecture = allLectures.find((lecture) => {
        if (excludeLectureId && lecture.id === excludeLectureId) {
            return false;
        }

        if (lecture.instructorId !== instructorId) {
            return false;
        }

        if (!isSameDayCheck(lecture.date, date)) {
            return false;
        }

        // Check time overlap
        const lectureStart = lecture.startTime;
        const lectureEnd = lecture.endTime;

        // Convert times to minutes for easier comparison
        const toMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const newStart = toMinutes(startTime);
        const newEnd = toMinutes(endTime);
        const existingStart = toMinutes(lectureStart);
        const existingEnd = toMinutes(lectureEnd);

        // Check if time ranges overlap
        return (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
        );
    });

    return {
        hasOverlap: !!overlappingLecture,
        overlappingLecture: overlappingLecture || null,
    };
};
