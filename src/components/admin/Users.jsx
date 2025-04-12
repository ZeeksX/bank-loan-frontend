import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Toast from '../Toast';

const Users = () => {
  const { customers = [] } = useOutletContext() ?? { customers: [] };
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    password: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    ssn: '',
    income: '',
    employment_status: '',
    occupation: '',
    employer: '',
    account_number: '',
    bank: '',
    credit_score: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit for new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get user token
      const token = localStorage.getItem('access_token');

      // Create request body
      const userData = {
        ...formData,
        income: parseFloat(formData.income),
        credit_score: parseInt(formData.credit_score)
      };

      // Send POST request to backend
      const response = await fetch('http://localhost:8000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Show success toast
      setToast({
        message: `User ${formData.first_name} ${formData.last_name} created successfully!`,
        type: 'success'
      });

      // Reset form and hide it
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        password: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        email: '',
        ssn: '',
        income: '',
        employment_status: '',
        occupation: '',
        employer: '',
        account_number: '',
        bank: '',
        credit_score: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setToast({
        message: error.message || 'Failed to create user. Please try again.',
        type: 'error'
      });
    }
  };
  console.log('Customers', customers)

  // User actions
  const handleView = (id) => console.log(`View user ${id}`);
  const handleEdit = (id) => console.log(`Edit user ${id}`);
  const handleSuspend = (id) => console.log(`Suspend user ${id}`);
  const handleActivate = (id) => console.log(`Activate user ${id}`);

  return (
    <div className="space-y-4 inter">
      {/* Toast component for feedback */}
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>

        {/* New User Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 border bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Create New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BVN *</label>
                  <input
                    type="text"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Address Information */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Financial Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income</label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Retired">Retired</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                  <input
                    type="text"
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Banking Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <input
                    type="text"
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
                  <input
                    type="number"
                    name="credit_score"
                    value={formData.credit_score}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="300"
                    max="850"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Users Table */}
        <div className="border bg-white rounded-lg shadow-sm mt-8">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">User ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Registration Date</th>
                    <th scope="col" className="px-6 py-3">ID Verification</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{customer.customer_id}</td>
                      <td className="px-6 py-4">{customer.first_name} {customer.last_name}</td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">{new Date(customer.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${customer.id_verification_status === 'Verified'
                            ? 'bg-green-100 text-green-800'
                            : customer.id_verification_status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {customer.id_verification_status || 'Pending'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleView(customer.customer_id)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">View</button>
                          <button onClick={() => handleEdit(customer.customer_id)} className="text-gray-600 hover:text-gray-800 text-xs p-1 font-medium">Edit</button>
                          {customer.id_verification_status !== 'Rejected' ? (
                            <button onClick={() => handleSuspend(customer.customer_id)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Suspend</button>
                          ) : (
                            <button onClick={() => handleActivate(customer.customer_id)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Activate</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr className="bg-white border-b">
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Users;