// Instructor Dashboard - View assigned lectures
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    BookOpen,
    LogOut,
    GraduationCap,
    Filter,
    SortAsc,
    Calendar as CalendarIcon,
    List,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LectureCalendar from '../../components/LectureCalendar';

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { lectures, courses, instructors, getInstructorLectures, getCourseById } = useData();
    const { success } = useToast();

    const [filterStatus, setFilterStatus] = useState('upcoming'); // 'all', 'upcoming', 'past'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar'

    // Get lectures for current instructor
    const myLectures = getInstructorLectures(currentUser?.id);

    // Filter and sort lectures
    const filteredLectures = useMemo(() => {
        let filtered = [...myLectures];

        // Filter by status
        const now = new Date();
        if (filterStatus === 'upcoming') {
            filtered = filtered.filter((lecture) => new Date(lecture.date) >= now);
        } else if (filterStatus === 'past') {
            filtered = filtered.filter((lecture) => new Date(lecture.date) < now);
        }

        // Sort by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [myLectures, filterStatus, sortOrder]);

    // Calculate statistics
    const stats = {
        total: myLectures.length,
        upcoming: myLectures.filter((l) => new Date(l.date) >= new Date()).length,
        past: myLectures.filter((l) => new Date(l.date) < new Date()).length,
        uniqueCourses: new Set(myLectures.map((l) => l.courseId)).size,
    };

    const handleLogout = () => {
        logout();
        success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">SmartSchedule</h1>
                                <p className="text-xs text-gray-500">Instructor Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {currentUser?.name}
                                </p>
                                <p className="text-xs text-gray-500">Instructor</p>
                            </div>
                            {currentUser?.avatar && (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={LogOut}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {currentUser?.name?.split(' ')[0]}!
                        </h2>
                        <p className="text-gray-600">
                            Here's an overview of your teaching schedule
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Lectures</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.past}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Courses</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.uniqueCourses}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1.5 rounded-md smooth-transition flex items-center gap-2 ${viewMode === 'list'
                                        ? 'bg-white shadow-sm text-primary'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    <span className="text-sm font-medium">List</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-3 py-1.5 rounded-md smooth-transition flex items-center gap-2 ${viewMode === 'calendar'
                                        ? 'bg-white shadow-sm text-primary'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    <CalendarIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Calendar</span>
                                </button>
                            </div>

                            {viewMode === 'list' && (
                                <>
                                    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                                        <button
                                            onClick={() => setFilterStatus('all')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md smooth-transition ${filterStatus === 'all'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setFilterStatus('upcoming')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md smooth-transition ${filterStatus === 'upcoming'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Upcoming
                                        </button>
                                        <button
                                            onClick={() => setFilterStatus('past')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md smooth-transition ${filterStatus === 'past'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Past
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 smooth-transition"
                                    >
                                        <SortAsc className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                        Sort Date
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {viewMode === 'calendar' ? (
                        <LectureCalendar
                            lectures={myLectures}
                            courses={courses}
                            instructors={instructors}
                            title=""
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredLectures.length === 0 ? (
                                <Card>
                                    <div className="text-center py-12 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No lectures found</p>
                                    </div>
                                </Card>
                            ) : (
                                filteredLectures.map((lecture) => {
                                    const course = getCourseById(lecture.courseId);
                                    const isPast = new Date(lecture.date) < new Date();
                                    const isToday =
                                        new Date(lecture.date).toDateString() === new Date().toDateString();

                                    return (
                                        <Card
                                            key={lecture.id}
                                            className={`relative overflow-hidden ${isPast ? 'opacity-70' : ''
                                                }`}
                                        >
                                            {/* Status Indicator */}
                                            {isToday && (
                                                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                                                    TODAY
                                                </div>
                                            )}

                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                {/* Course Badge */}
                                                <div
                                                    className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                                                    style={{ backgroundColor: course?.color || '#2563EB' }}
                                                >
                                                    {course?.name?.charAt(0) || 'C'}
                                                </div>

                                                {/* Lecture Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {course?.name || 'Unknown Course'}
                                                    </h3>
                                                    {lecture.topic && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            Topic: {lecture.topic}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(lecture.date, 'EEEE, MMM dd, yyyy')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>
                                                                {lecture.startTime} - {lecture.endTime}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4" />
                                                            <span>{course?.level || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex-shrink-0">
                                                    <span
                                                        className={`px-4 py-2 rounded-lg font-semibold text-sm ${isPast
                                                            ? 'bg-gray-100 text-gray-600'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}
                                                    >
                                                        {isPast ? 'Completed' : 'Upcoming'}
                                                    </span>
                                                </div>
                                            </div>

                                            {lecture.notes && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold">Notes:</span> {lecture.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}

                </div>

            </main>
        </div>
    );
};

export default InstructorDashboard;
