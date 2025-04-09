import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Assuming you have lucide-react installed
import { Link, useNavigate } from 'react-router-dom'; // Assuming you use React Router
import Toast from '../components/Toast'; // Your Toast component
import google from "../assets/google.svg"; // Google icon asset
// import { useAuth } from "../components/Auth"; // Keep if you implement Auth logic

const Register = () => {
  // --- State Variables ---
  const [formData, setFormData] = useState({
    // From customers table
    first_name: '',
    last_name: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '', // Keep for user account login
    ssn: '',
    income: '',
    employment_status: '',
    credit_score: '',
    // For user account
    password: '', // Keep for user account login
  });

  const [errors, setErrors] = useState({}); // For form validation errors
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Although maybe less relevant for register? Included as it was there.
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info', // 'info', 'success', 'warning', 'error'
  });

  // const { register } = useAuth(); // Get register function from Auth context if implemented
  const navigate = useNavigate();

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    // --- Basic Validation Placeholder ---
    let validationErrors = {};

    if (!formData.first_name) validationErrors.first_name = 'First name is required.';
    if (!formData.last_name) validationErrors.last_name = 'Last name is required.';
    if (!formData.date_of_birth) validationErrors.date_of_birth = 'Date of birth is required.';
    if (!formData.address) validationErrors.address = 'Address is required.';
    if (!formData.city) validationErrors.city = 'City is required.';
    if (!formData.state) validationErrors.state = 'State is required.';
    if (!formData.postal_code) validationErrors.postal_code = 'Postal code is required.';
    if (!formData.country) validationErrors.country = 'Country is required.';
    if (!formData.phone) validationErrors.phone = 'Phone number is required.';
    if (!formData.email) validationErrors.email = 'Email is required.';
    if (!formData.password) validationErrors.password = 'Password is required.';

    // Optional Fields with Validation
    if (formData.income && isNaN(formData.income)) {
      validationErrors.income = 'Income must be a valid number.';
    }
    if (formData.credit_score && (isNaN(formData.credit_score) || formData.credit_score < 300 || formData.credit_score > 850)) {
      validationErrors.credit_score = 'Credit score must be between 300 and 850.';
    }
    if (formData.employment_status && formData.employment_status.length < 2) {
      validationErrors.employment_status = 'Employment status must be at least 2 characters long.';
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required.';
    }
    if (!formData.first_name.trim()) {
      validationErrors.email = 'First name is required.';
    }
    if (!formData.last_name.trim()) {
      validationErrors.email = 'Last name is required.';
    }
    if (formData.ssn && !/^\d{11}$/.test(formData.ssn)) {
      validationErrors.ssn = 'BVN must be 11 digits long.';
    }
    if (!formData.ssn.trim()) {
      validationErrors.ssn = 'BVN is required.';
    }
    if (formData.date_of_birth) {
      const today = new Date();
      const dob = new Date(formData.date_of_birth);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        validationErrors.date_of_birth = 'You must be at least 18 years old.';
      }
    }
    // Password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      validationErrors.password = 'Password must contain at least 6 characters, one uppercase letter, one number, and one special character.';
    }



    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      console.log("Form data: ", formData)
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/login")
        }, 1000);

      }
      setToast('Login successful!', 'success');

    } catch (error) {
      console.error('Login error:', error);
      setToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />

      <div className="min-h-screen inter flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex mb-4 p-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 inter rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              B
            </div>
            <span className="text-2xl font-bold text-gray-800">BankSecure</span>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className='flex items-center justify-center w-full px-4'>
          <div className='w-full max-w-2xl mx-auto px-8 py-10 bg-white rounded-lg shadow-lg mb-8'>
            {/* Form Header */}
            <div className='flex flex-col items-center justify-center mb-8'>
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Your Account</h1>
              <p className="text-center text-gray-600">Join the Loan Management System</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" required
                    className={`w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required
                    className={`w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  <button type="button" className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Date of Birth & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input id="date_of_birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required
                    className={`w-full px-3 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.date_of_birth && <p className="text-sm text-red-600">{errors.date_of_birth}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555 123 4567" required
                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              {/* Address, Social Sceurity Number*/}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" required
                    className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">BVN</label>
                  <input id="ssn" type="text" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="12345678901" required
                    className={`w-full px-3 py-2 border ${errors.ssn ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.ssn && <p className="text-sm text-red-600">{errors.ssn}</p>}
                </div>
              </div>


              {/* City, State, Postal Code, Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Anytown" required
                    className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                  <input id="state" type="text" name="state" value={formData.state} onChange={handleChange} placeholder="CA" required
                    className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input id="postal_code" type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="90210" required
                    className={`w-full px-3 py-2 border ${errors.postal_code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.postal_code && <p className="text-sm text-red-600">{errors.postal_code}</p>}
                </div>
                <div className="space-y-1">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input id="country" type="text" name="country" value={formData.country} onChange={handleChange} placeholder="United States" required
                    className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                </div>
              </div>

              {/* Optional Fields: SSN, Income, Employment, Credit Score */}
              <details className="group pt-2">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 list-none group-open:mb-3">
                  Optional Information <span className="group-open:hidden">+</span><span className="hidden group-open:inline">-</span>
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="income" className="block text-sm font-medium text-gray-700">Annual Income</label>
                    <input id="income" type="number" name="income" step="0.01" value={formData.income} onChange={handleChange} placeholder="50000"
                      className={`w-full px-3 py-2 border ${errors.income ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.income && <p className="text-sm text-red-600">{errors.income}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">Employment Status</label>
                    <input id="employment_status" type="text" name="employment_status" value={formData.employment_status} onChange={handleChange} placeholder="Employed"
                      className={`w-full px-3 py-2 border ${errors.employment_status ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.employment_status && <p className="text-sm text-red-600">{errors.employment_status}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700">Credit Score</label>
                    <input id="credit_score" type="number" name="credit_score" value={formData.credit_score} onChange={handleChange} placeholder="700"
                      className={`w-full px-3 py-2 border ${errors.credit_score ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.credit_score && <p className="text-sm text-red-600">{errors.credit_score}</p>}
                  </div>
                </div>
              </details>

              {/* Submit Buttons */}
              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full flex cursor-pointer justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account... </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <button
                  type="button" // Changed to button type to prevent form submission
                  // onClick={handleGoogleSignUp} // Add a handler for Google Sign Up
                  className="w-full cursor-pointer flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading} // Disable during primary registration loading
                >
                  <img src={google} className='w-5 h-5 mr-2' alt="Google" />
                  Sign up with Google
                </button>
              </div>

              {/* Link to Login */}
              <div className="text-center text-sm text-gray-600 pt-4">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium cursor-pointer text-blue-600 hover:text-blue-700">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;