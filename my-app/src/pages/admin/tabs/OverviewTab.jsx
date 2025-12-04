// Overview Tab - Dashboard statistics and summary
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import Card from '../../../components/Card';

const OverviewTab = ({ onTabChange }) => {
    const { instructors, courses, lectures } = useData();

    // Calculate statistics
    const stats = [
        {
            label: 'Total Instructors',
            value: instructors.length,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Total Courses',
            value: courses.length,
            icon: BookOpen,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Scheduled Lectures',
            value: lectures.length,
            icon: Calendar,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
        },
        {
            label: 'Active Sessions',
            value: lectures.filter((l) => new Date(l.date) >= new Date()).length,
            icon: TrendingUp,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
        },
    ];

    // Get recent lectures
    const recentLectures = [...lectures]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-7 h-7 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className={`absolute -bottom-1 -right-1 w-20 h-20 ${stat.color} opacity-10 rounded-full`} />
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Lectures</h2>
                {recentLectures.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No lectures scheduled yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentLectures.map((lecture) => {
                            const course = courses.find((c) => c.id === lecture.courseId);
                            const instructor = instructors.find((i) => i.id === lecture.instructorId);
                            return (
                                <div
                                    key={lecture.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 smooth-transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: course?.color || '#2563EB' }}
                                        >
                                            {course?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{course?.name || 'Unknown Course'}</p>
                                            <p className="text-sm text-gray-600">
                                                Instructor: {instructor?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(lecture.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {lecture.startTime} - {lecture.endTime}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => onTabChange('instructors')}
                        className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg smooth-transition"
                    >
                        <Users className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Add Instructor</p>
                    </button>
                    <button
                        onClick={() => onTabChange('courses')}
                        className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg smooth-transition"
                    >
                        <BookOpen className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Add Course</p>
                    </button>
                    <button
                        onClick={() => onTabChange('schedule')}
                        className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg smooth-transition"
                    >
                        <Calendar className="w-6 h-6 mb-2" />
                        <p className="font-semibold">Schedule Lecture</p>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default OverviewTab;
