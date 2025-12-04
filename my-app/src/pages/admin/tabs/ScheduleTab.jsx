// Schedule Tab - Manage lecture scheduling with conflict detection
import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, List, Trash2, AlertCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { validateLecture } from '../../../utils/validation';
import { formatDate } from '../../../utils/dateUtils';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';
import LectureCalendar from '../../../components/LectureCalendar';

const ScheduleTab = () => {
    const {
        lectures,
        courses,
        instructors,
        addLecture,
        updateLecture,
        deleteLecture,
        getCourseById,
        getInstructorById,
    } = useData();
    const { success, error: showError } = useToast();

    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [formData, setFormData] = useState({
        courseId: '',
        instructorId: '',
        date: '',
        startTime: '',
        endTime: '',
        topic: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});

    // Sort lectures by date
    const sortedLectures = [...lectures].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateLecture(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Validate time range
        if (formData.startTime >= formData.endTime) {
            setErrors({ endTime: 'End time must be after start time' });
            return;
        }

        // Validate date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.date);
        if (selectedDate < today) {
            setErrors({ date: 'Cannot schedule lectures in the past' });
            return;
        }

        // Add/Update lecture (conflict detection happens in DataContext)
        let result;
        if (editMode) {
            result = updateLecture(selectedLecture.id, formData);
        } else {
            result = addLecture(formData);
        }

        if (result.success) {
            success(editMode ? 'Lecture updated successfully!' : 'Lecture scheduled successfully!');
            // Reset form and close modal
            resetForm();
        } else {
            // Show conflict error
            showError(result.error);
            if (result.conflict) {
                const conflictCourse = getCourseById(result.conflict.courseId);
                showError(
                    `Conflict with: ${conflictCourse?.name} on ${formatDate(
                        result.conflict.date
                    )} at ${result.conflict.startTime}`
                );
            }
        }
    };

    const handleEdit = (lecture) => {
        setSelectedLecture(lecture);
        setFormData({
            courseId: lecture.courseId,
            instructorId: lecture.instructorId,
            date: lecture.date,
            startTime: lecture.startTime,
            endTime: lecture.endTime,
            topic: lecture.topic || '',
            notes: lecture.notes || '',
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            courseId: '',
            instructorId: '',
            date: '',
            startTime: '',
            endTime: '',
            topic: '',
            notes: '',
        });
        setErrors({});
        setEditMode(false);
        setSelectedLecture(null);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            deleteLecture(id);
            success('Lecture deleted successfully');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
                    <p className="text-gray-600">Manage lecture schedules and assignments</p>
                </div>
                <div className="flex gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md smooth-transition ${viewMode === 'list'
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-600'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-md smooth-transition ${viewMode === 'calendar'
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-600'
                                }`}
                        >
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Schedule Lecture
                    </Button>
                </div>
            </div>



            {/* Lectures List */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {sortedLectures.length === 0 ? (
                        <Card>
                            <div className="text-center py-12 text-gray-500">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No lectures scheduled yet</p>
                                <Button
                                    variant="primary"
                                    className="mt-4"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Schedule Your First Lecture
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        sortedLectures.map((lecture) => {
                            const course = getCourseById(lecture.courseId);
                            const instructor = getInstructorById(lecture.instructorId);
                            const isPast = new Date(lecture.date) < new Date();

                            return (
                                <Card
                                    key={lecture.id}
                                    className={`${isPast ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Course Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div
                                                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                                                style={{ backgroundColor: course?.color || '#2563EB' }}
                                            >
                                                {course?.name?.charAt(0) || 'C'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                                    {course?.name || 'Unknown Course'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {lecture.topic || 'No topic specified'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <img
                                                        src={instructor?.avatar}
                                                        alt={instructor?.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        {instructor?.name || 'Unknown Instructor'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(lecture.date, 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Time</p>
                                                <p className="font-semibold text-gray-900">
                                                    {lecture.startTime} - {lecture.endTime}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={List}
                                                    onClick={() => handleEdit(lecture)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => handleDelete(lecture.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {lecture.notes && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">{lecture.notes}</p>
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <LectureCalendar
                    lectures={lectures}
                    courses={courses}
                    instructors={instructors}
                    title="All Scheduled Lectures"
                />
            )}

            {/* Add/Edit Lecture Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={resetForm}
                title={editMode ? 'Edit Lecture' : 'Schedule New Lecture'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course
                        </label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.level})
                                </option>
                            ))}
                        </select>
                        {errors.courseId && (
                            <p className="text-sm text-red-600 mt-1">{errors.courseId}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructor
                        </label>
                        <select
                            name="instructorId"
                            value={formData.instructorId}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select an instructor</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.name} - {instructor.specialization || 'General'}
                                </option>
                            ))}
                        </select>
                        {errors.instructorId && (
                            <p className="text-sm text-red-600 mt-1">{errors.instructorId}</p>
                        )}
                    </div>

                    <Input
                        label="Date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        error={errors.date}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Time"
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            error={errors.startTime}
                            required
                        />
                        <Input
                            label="End Time"
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            error={errors.endTime}
                            required
                        />
                    </div>

                    <Input
                        label="Topic (optional)"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        placeholder="e.g., Introduction to React Hooks"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Additional notes or instructions"
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1">
                            {editMode ? 'Update Lecture' : 'Schedule Lecture'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ScheduleTab;
