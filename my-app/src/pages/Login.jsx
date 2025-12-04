// Login Page for Admin and Instructors
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { instructors } = useData();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const result = login(formData.email, formData.password, instructors);

            if (result.success) {
                success(`Welcome back, ${result.user.name}!`);
                // Navigate based on role
                if (result.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/instructor/dashboard');
                }
            } else {
                showError(result.error);
            }

            setLoading(false);
        }, 800);
    };

    // Quick login buttons for demo
    const quickLogin = (email, password) => {
        setFormData({ email, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">SmartSchedule</h1>
                    <p className="text-gray-600">Smart Scheduling for Smarter Learning</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            placeholder="Enter your email"
                            error={errors.email}
                            autoComplete="email"
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={Lock}
                            placeholder="Enter your password"
                            error={errors.password}
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3 font-medium">Quick Login (Demo):</p>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => quickLogin('admin@smart.com', 'admin123')}
                                className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg smooth-transition text-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-primary">Admin</span>
                                        <span className="text-gray-600 ml-2">admin@smart.com</span>
                                    </div>
                                    <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                        Pass: admin123
                                    </span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => quickLogin('sarah@smart.com', 'sarah123')}
                                className="w-full text-left px-4 py-2 bg-cyan-50 hover:bg-cyan-100 rounded-lg smooth-transition text-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-accent">Instructor</span>
                                        <span className="text-gray-600 ml-2">sarah@smart.com</span>
                                    </div>
                                    <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                        Pass: sarah123
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2024 SmartSchedule. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
