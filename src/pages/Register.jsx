import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import google from "../assets/google.svg";

const InputField = ({ id, label, name, type = "text", value, onChange, placeholder, error, required = false, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Register = () => {
  const initialFormData = {
    first_name: '', last_name: '', date_of_birth: '', address: '', city: '',
    state: '', postal_code: '', country: '', phone: '', email: '',
    ssn: '', income: '', employment_status: '', credit_score: '', password: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const navigate = useNavigate();

  const requiredFields = [
    'first_name', 'last_name', 'date_of_birth', 'address', 'city',
    'state', 'postal_code', 'country', 'phone', 'email', 'ssn', 'password'
  ];

  const validateForm = () => {
    const validationErrors = {};

    // Required field validation
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        validationErrors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required.`;
      }
    });

    // Specific validations
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (formData.date_of_birth) {
      const today = new Date();
      const dob = new Date(formData.date_of_birth);
      const age = today.getFullYear() - dob.getFullYear() -
        (today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);
      if (age < 18) {
        validationErrors.date_of_birth = 'You must be at least 18 years old.';
      }
    }

    if (formData.password && !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{6,}$/.test(formData.password)) {
      validationErrors.password = 'Password must contain at least 6 characters, one uppercase letter, one number, and one special character.';
    }

    if (formData.income && isNaN(formData.income)) {
      validationErrors.income = 'Income must be a valid number.';
    }

    if (formData.credit_score && (isNaN(formData.credit_score) || formData.credit_score < 300 || formData.credit_score > 850)) {
      validationErrors.credit_score = 'Credit score must be between 300 and 850.';
    }

    if (formData.employment_status && formData.employment_status.length < 2) {
      validationErrors.employment_status = 'Employment status must be at least 2 characters long.';
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bank-loan-backend-4cyr.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        console.warn("Response did not return JSON, got:", await response.text());
      }

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToast({ message: 'Registration successful!', type: 'success' });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setToast({ message: data.message || 'Registration failed. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Register error:', error);
      setToast({ message: error.message || 'Registration failed. Please try again.', type: 'error', open: true });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

  return (
    <>
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(prev => ({ ...prev, message: '' }))}
      />

      <div className="min-h-screen inter flex flex-col bg-gray-50">
        <div className="flex mb-4 p-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 inter rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">B</div>
            <span className="text-2xl font-bold text-gray-800">BankSecure</span>
          </div>
        </div>

        <div className="flex items-center justify-center w-full px-4">
          <div className="w-full max-w-2xl mx-auto px-8 py-10 bg-white rounded-lg shadow-lg mb-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Your Account</h1>
              <p className="text-center text-gray-600">Join the Loan Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="first_name" label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" error={errors.first_name} required />
                <InputField id="last_name" label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" error={errors.last_name} required />
              </div>

              <InputField id="email" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={inputClassName}
                  />
                  <button type="button" className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="date_of_birth" label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} error={errors.date_of_birth} required />
                <InputField id="phone" label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 555 123 4567" error={errors.phone} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="address" label="Street Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" error={errors.address} required />
                <InputField id="ssn" label="BVN" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="12345678901" error={errors.ssn} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField id="city" label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Anytown" error={errors.city} required />
                <InputField id="state" label="State / Province" name="state" value={formData.state} onChange={handleChange} placeholder="CA" error={errors.state} required />
                <InputField id="postal_code" label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="90210" error={errors.postal_code} required />
                <InputField id="country" label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="United States" error={errors.country} required />
              </div>

              <details className="group pt-2">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 list-none group-open:mb-3">
                  Optional Information <span className="group-open:hidden">+</span><span className="hidden group-open:inline">-</span>
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField id="income" label="Annual Income" name="income" type="number" step="0.01" value={formData.income} onChange={handleChange} placeholder="50000" error={errors.income} />
                  <InputField id="employment_status" label="Employment Status" name="employment_status" value={formData.employment_status} onChange={handleChange} placeholder="Employed" error={errors.employment_status} />
                  <InputField id="credit_score" label="Credit Score" name="credit_score" type="number" value={formData.credit_score} onChange={handleChange} placeholder="700" error={errors.credit_score} />
                </div>
              </details>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account... </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <button
                  type="button"
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <img src={google} className="w-5 h-5 mr-2" alt="Google" />
                  Sign up with Google
                </button>
              </div>

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
};

export default Register;