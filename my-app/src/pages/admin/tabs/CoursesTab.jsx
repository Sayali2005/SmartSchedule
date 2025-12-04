// Courses Tab - Manage courses
import { useState } from 'react';
import { Plus, Search, Trash2, Edit, Clock } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { validateCourse } from '../../../utils/validation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';

const CoursesTab = () => {
    const { courses, addCourse, updateCourse, deleteCourse, getCourseLectures } = useData();
    const { success, error: showError } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [viewLecturesModalOpen, setViewLecturesModalOpen] = useState(false);
    const [courseLectures, setCourseLectures] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        description: '',
        duration: '',
        image: '',
        color: '#2563EB',
    });
    const [errors, setErrors] = useState({});

    // Filter courses based on search
    const filteredCourses = courses.filter(
        (course) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        const validation = validateCourse(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        if (editMode) {
            // Update course
            updateCourse(selectedCourse.id, formData);
            success('Course updated successfully!');
        } else {
            // Add course
            addCourse(formData);
            success('Course added successfully!');
        }

        // Reset form and close modal
        resetForm();
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setFormData({
            name: course.name,
            level: course.level,
            description: course.description,
            duration: course.duration || '',
            image: course.image || '',
            color: course.color || '#2563EB',
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleViewLectures = (course) => {
        setSelectedCourse(course);
        setCourseLectures(getCourseLectures(course.id));
        setViewLecturesModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            level: '',
            description: '',
            duration: '',
            image: '',
            color: '#2563EB',
        });
        setErrors({});
        setEditMode(false);
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteCourse(id);
            success('Course deleted successfully');
        }
    };

    const levelColors = {
        Beginner: 'bg-green-100 text-green-800',
        Intermediate: 'bg-yellow-100 text-yellow-800',
        Advanced: 'bg-red-100 text-red-800',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
                    <p className="text-gray-600">Manage your course catalog</p>
                </div>
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Course
                </Button>
            </div>

            {/* Search Bar */}
            <Card>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses by name, level, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p>No courses found</p>
                    </div>
                ) : (
                    filteredCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden p-0">
                            {/* Course Image */}
                            <div
                                className="h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white"
                                style={{
                                    background: course.image
                                        ? `url(${course.image}) center/cover`
                                        : `linear-gradient(135deg, ${course.color} 0%, ${course.color}dd 100%)`,
                                }}
                            >
                                {!course.image && (
                                    <span className="text-5xl font-bold opacity-50">
                                        {course.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            {/* Course Info */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                                        {course.name}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded ${levelColors[course.level] || 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {course.level}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                {course.duration && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                        icon={Clock}
                                        onClick={() => handleViewLectures(course)}
                                    >
                                        View Lectures
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1"
                                            icon={Edit}
                                            onClick={() => handleEdit(course)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="flex-1"
                                            icon={Trash2}
                                            onClick={() => handleDelete(course.id, course.name)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Add/Edit Course Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={resetForm}
                title={editMode ? 'Edit Course' : 'Add New Course'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Course Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Web Development Fundamentals"
                        error={errors.name}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level
                        </label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        {errors.level && (
                            <p className="text-sm text-red-600 mt-1">{errors.level}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Brief description of the course"
                            rows={3}
                            className="input-field resize-none"
                            required
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                        )}
                    </div>

                    <Input
                        label="Duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 12 weeks"
                    />

                    <Input
                        label="Image URL (optional)"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                        </label>
                        <input
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
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
                            {editMode ? 'Update Course' : 'Add Course'}
                        </Button>
                    </div>
                </form>
            </Modal>
            {/* View Lectures Modal */}
            <Modal
                isOpen={viewLecturesModalOpen}
                onClose={() => setViewLecturesModalOpen(false)}
                title={`Lectures for ${selectedCourse?.name}`}
                size="lg"
            >
                <div className="space-y-4">
                    {courseLectures.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No lectures scheduled for this course yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {courseLectures.map((lecture) => (
                                <div
                                    key={lecture.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {new Date(lecture.date).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {lecture.startTime} - {lecture.endTime}
                                        </p>
                                        {lecture.topic && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Topic: {lecture.topic}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-end pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setViewLecturesModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CoursesTab;
