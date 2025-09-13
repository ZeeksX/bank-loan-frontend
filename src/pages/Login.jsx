import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import google from "../assets/google.svg";
import { useAuth } from "../components/Auth";
import Loader from "../components/ui/Loader";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loader, showLoader] = useState(false);

    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const [toast, setToast] = useState({ message: '', type: 'info' });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setToast({ message: 'Please fill in all fields correctly', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("https://bank-loan-backend-4cyr.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            if (response.ok) {
                const data = await response.json();
                const userRoleFromAPI = data.user?.role;

                // --- Basic validation of response structure ---
                if (!userRoleFromAPI || !data.user || !data.tokens?.access || !data.tokens?.refresh) {
                    console.error("Incomplete login response from API:", data);
                    setToast({ message: 'Login failed: Incomplete data received.', type: 'error' });
                    setIsLoading(false);
                    return;
                }

                const userData = {
                    ...data.user,
                    access: data.tokens.access,
                    refresh: data.tokens.refresh,
                };
                login(userData);

                setToast({ message: 'Login successful!', type: 'success' });
                showLoader(true);

                console.log("Redirecting based on role:", userRoleFromAPI);
                if (['admin', 'loan_officer', 'manager'].includes(userRoleFromAPI)) {
                    navigate('/admin/dashboard');
                } else if (userRoleFromAPI === 'customer') {
                    navigate("/dashboard");
                } else {
                    console.warn("Login successful but user has an unexpected role:", userRoleFromAPI);
                    navigate("/dashboard");
                }

            } else {
                const errorData = await response.json();
                setToast({
                    message: errorData.message || 'Login failed. Please check your credentials.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed due to a network or server issue.';
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: 'info' })}
            />

            <div className="min-h-screen inter flex flex-col bg-gray-50">
                <div className="flex mb-2 p-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 inter rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                            B
                        </div>
                        <span className="text-2xl font-bold text-gray-800">BankSecure</span>
                    </div>
                </div>

                <div className='login flex items-center overflow-y-scroll max-h-[80vh] w-md mx-auto justify-center flex-col px-8 py-12 bg-white rounded-lg shadow-lg'>
                    <div className='flex flex-col items-center justify-center '>
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Loan Management System</h1>
                        <p className="text-center text-gray-600 mb-8">Sign in to access your dashboard</p>

                        <form onSubmit={handleSubmit} className="space-y-6 w-full">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm font-medium text-blue-500 hover:text-blue-700">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md cursor-pointer shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>

                            <button
                                type="button"
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md cursor-pointer shadow-sm text-base font-medium hover:text-white bg-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <img src={google} className='w-6 h-6 mr-2' alt="Google" />
                                        Sign in with Google
                                    </>
                                )}
                            </button>

                            <div className="text-center text-sm text-gray-600">
                                <p>
                                    Don't have an account? {' '}
                                    <a href="/register" className="font-medium text-blue-500 hover:text-blue-700">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {loader && <Loader />}
        </>
    );
};

export default Login;
