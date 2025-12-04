// Instructors Tab - Manage instructors
import { useState } from 'react';
import { Plus, Mail, Phone, Search, Trash2, Edit } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { validateInstructor } from '../../../utils/validation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';

const InstructorsTab = () => {
    const { instructors, addInstructor, updateInstructor, deleteInstructor } = useData();
    const { success, error: showError } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
    });
    const [errors, setErrors] = useState({});

    // Filter instructors based on search
    const filteredInstructors = instructors.filter(
        (instructor) =>
            instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instructor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
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
        const validation = validateInstructor(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Check if email already exists (except for current instructor in edit mode)
        const emailExists = instructors.some(
            (inst) => inst.email === formData.email && inst.id !== selectedInstructor?.id
        );
        if (emailExists) {
            showError('An instructor with this email already exists');
            return;
        }

        if (editMode) {
            // Update instructor
            updateInstructor(selectedInstructor.id, formData);
            success('Instructor updated successfully!');
        } else {
            // Add instructor
            addInstructor(formData);
            success('Instructor added successfully!');
        }

        // Reset form and close modal
        resetForm();
    };

    const handleEdit = (instructor) => {
        setSelectedInstructor(instructor);
        setFormData({
            name: instructor.name,
            email: instructor.email,
            password: instructor.password,
            phone: instructor.phone || '',
            specialization: instructor.specialization || '',
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            specialization: '',
        });
        setErrors({});
        setEditMode(false);
        setSelectedInstructor(null);
        setIsModalOpen(false);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            deleteInstructor(id);
            success('Instructor deleted successfully');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructors</h1>
                    <p className="text-gray-600">Manage your teaching staff</p>
                </div>
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Instructor
                </Button>
            </div>

            {/* Search Bar */}
            <Card>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search instructors by name, email, or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstructors.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p>No instructors found</p>
                    </div>
                ) : (
                    filteredInstructors.map((instructor) => (
                        <Card key={instructor.id} className="relative">
                            <div className="flex items-start gap-4">
                                <img
                                    src={instructor.avatar}
                                    alt={instructor.name}
                                    className="w-16 h-16 rounded-full bg-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 truncate">
                                        {instructor.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {instructor.specialization || 'No specialization'}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{instructor.email}</span>
                                        </div>
                                        {instructor.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                <span>{instructor.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1"
                                    icon={Edit}
                                    onClick={() => handleEdit(instructor)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="flex-1"
                                    icon={Trash2}
                                    onClick={() => handleDelete(instructor.id, instructor.name)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Add/Edit Instructor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={resetForm}
                title={editMode ? 'Edit Instructor' : 'Add New Instructor'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter instructor's full name"
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="instructor@example.com"
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Minimum 6 characters"
                        error={errors.password}
                        required
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1-555-0100"
                        error={errors.phone}
                    />

                    <Input
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science, Mathematics"
                    />

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
                            {editMode ? 'Update Instructor' : 'Add Instructor'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InstructorsTab;
