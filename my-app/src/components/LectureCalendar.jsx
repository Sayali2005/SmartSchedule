// Calendar Component for viewing lectures
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../utils/dateUtils';
import Modal from './Modal';
import Card from './Card';
import { Clock, User, BookOpen } from 'lucide-react';

const LectureCalendar = ({ lectures, courses, instructors, title = 'Lecture Calendar' }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    // Get lectures for selected date
    const getLecturesForDate = (date) => {
        return lectures.filter((lecture) => {
            const lectureDate = new Date(lecture.date);
            return (
                lectureDate.getDate() === date.getDate() &&
                lectureDate.getMonth() === date.getMonth() &&
                lectureDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const selectedLectures = getLecturesForDate(selectedDate);

    // Check if a date has lectures
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasLectures = getLecturesForDate(date).length > 0;
            if (hasLectures) {
                return 'has-lectures';
            }
        }
        return null;
    };

    // Handle date click
    const handleDateClick = (date) => {
        setSelectedDate(date);
        const lecturesOnDate = getLecturesForDate(date);
        if (lecturesOnDate.length > 0) {
            setShowModal(true);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

            {/* Calendar */}
            <Card className="p-4">
                <Calendar
                    onChange={handleDateClick}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    className="w-full border-none"
                />
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">Has Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">No Lectures</span>
                </div>
            </div>

            {/* Lectures for selected date (shown below calendar on mobile) */}
            {selectedLectures.length > 0 && (
                <Card className="lg:hidden">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Lectures on {formatDate(selectedDate, 'MMM dd, yyyy')}
                    </h3>
                    <div className="space-y-3">
                        {selectedLectures.map((lecture) => {
                            const course = courses.find((c) => c.id === lecture.courseId);
                            const instructor = instructors.find((i) => i.id === lecture.instructorId);
                            return (
                                <div
                                    key={lecture.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: course?.color || '#2563EB' }}
                                        >
                                            {course?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {course?.name || 'Unknown Course'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {lecture.topic || 'No topic'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{lecture.startTime} - {lecture.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{instructor?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{course?.level || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Modal for desktop */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`Lectures on ${formatDate(selectedDate, 'MMM dd, yyyy')}`}
                size="md"
            >
                {selectedLectures.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No lectures scheduled for this date</p>
                ) : (
                    <div className="space-y-3">
                        {selectedLectures.map((lecture) => {
                            const course = courses.find((c) => c.id === lecture.courseId);
                            const instructor = instructors.find((i) => i.id === lecture.instructorId);
                            return (
                                <div
                                    key={lecture.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: course?.color || '#2563EB' }}
                                        >
                                            {course?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {course?.name || 'Unknown Course'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {lecture.topic || 'No topic'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{lecture.startTime} - {lecture.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{instructor?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{course?.level || 'N/A'}</span>
                                        </div>
                                    </div>
                                    {lecture.notes && (
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold">Notes:</span> {lecture.notes}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>

            {/* Custom CSS for calendar */}
            <style jsx global>{`
        .react-calendar {
          border: none !important;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          padding: 1em 0.5em;
          border-radius: 0.5rem;
        }
        
        .react-calendar__tile--active {
          background: #2563EB !important;
          color: white !important;
        }
        
        .react-calendar__tile--now {
          background: #dbeafe;
        }
        
        .react-calendar__tile.has-lectures {
          background: #2563EB;
          color: white;
          font-weight: 600;
        }
        
        .react-calendar__tile.has-lectures:hover {
          background: #1d4ed8;
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: #ef4444;
        }
        
        .react-calendar__tile.has-lectures.react-calendar__month-view__days__day--weekend {
          color: white;
        }
        
        .dark .react-calendar {
          background: #1f2937;
          color: white;
        }
        
        .dark .react-calendar__tile {
          color: #d1d5db;
        }
        
        .dark .react-calendar__tile--now {
          background: #1e40af;
          color: white;
        }
        
        .dark .react-calendar__navigation button {
          color: white;
        }
        
        .dark .react-calendar__month-view__weekdays {
          color: #9ca3af;
        }
      `}</style>
        </div>
    );
};

export default LectureCalendar;
