import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Toast from '../Toast';

const Loans = () => {
  const {
    allApplications,
    customers
  } = useOutletContext() ?? {
    allApplications: [],
    customers: []
  };

  // Local state for applications (initialized to allApplications)
  const [applications, setApplications] = useState(allApplications);
  const [showForm, setShowForm] = useState(false);
  const [loanProducts, setLoanProducts] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Form Data state
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    requested_amount: '',
    requested_term: '',
    purpose: '',
    application_reference: ``
  });

  // Fetch loan products on mount
  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        const response = await fetch('https://bank-loan-backend-4cyr.onrender.com/api/loans/products');
        if (response.ok) {
          const data = await response.json();
          setLoanProducts(data);
        } else {
          console.error("Failed to fetch loan products.");
          setToast({ message: 'Failed to fetch loan products', type: 'error' });
        }
      } catch (err) {
        console.error("Error fetching loan products:", err);
        setToast({ message: 'Error fetching loan products', type: 'error' });
      }
    };

    fetchLoanProducts();
  }, []);

  // Get the selected product object based on formData.product_id
  const selectedProduct = loanProducts.find(
    p => p.product_id.toString() === formData.product_id.toString()
  );

  // Status mapping for display
  const statusMapping = {
    submitted: 'Pending',
    under_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled'
  };

  // Return a Tailwind color class based on status display value.
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for a new loan application.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lookup selected customer and product
      const customer = customers.find(
        c => c.customer_id.toString() === formData.customer_id.toString()
      );
      const product = loanProducts.find(
        p => p.product_id.toString() === formData.product_id.toString()
      );

      if (!customer || !product) {
        throw new Error('Invalid customer or product selection');
      }

      // For API: you may get user token and such
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('access_token');

      const dataSent = {
        customer_id: user?.userId,
        product_id: parseInt(formData.product_id),
        requested_amount: parseFloat(formData.requested_amount),
        requested_term: parseInt(formData.requested_term),
        purpose: formData.product_id,
      };
      console.log("Data Sent", dataSent)

      // Send POST request to backend
      const response = await fetch('https://bank-loan-backend-4cyr.onrender.com/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataSent),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setToast({
        message: `Application for ${product.product_name} submitted successfully!`,
        type: 'success'
      });

      // Reset the form and hide it
      setShowForm(false);
      setFormData({
        customer_id: '',
        product_id: '',
        requested_amount: '',
        requested_term: '',
        purpose: '',
        application_reference: `BL-${Math.floor(100000 + Math.random() * 900000)}`
      });
    } catch (error) {
      console.error("Submission Error:", error);
      setToast({
        message: error.message || 'Failed to submit application. Please try again.',
        type: 'error'
      });
    }
  };

  // Handlers for review/approve/reject actions
  const handleReview = (index) => {
    setCurrentApplication(applications[index]);
    setReviewModalOpen(true);
  };

  const handleApprove = (index) => {
    const updatedApplications = [...applications];
    updatedApplications[index] = {
      ...updatedApplications[index],
      status: 'approved',
      review_date: new Date().toISOString().split('T')[0],
      reviewed_by: 1 // replace with actual authenticated ID
    };
    setApplications(updatedApplications);
    // TODO: Make API call to update the application status
  };

  const handleReject = (index) => {
    const updatedApplications = [...applications];
    updatedApplications[index] = {
      ...updatedApplications[index],
      status: 'rejected',
      review_date: new Date().toISOString().split('T')[0],
      reviewed_by: 1 // replace with actual authenticated ID
    };
    setApplications(updatedApplications);
    // TODO: Make API call to update the application status
  };

  const submitReview = () => {
    if (!currentApplication) return;
    const index = applications.findIndex(app => app.application_reference === currentApplication.application_reference);
    if (index === -1) return;
    const updatedApplications = [...applications];
    updatedApplications[index] = {
      ...updatedApplications[index],
      status: 'under_review',
      review_notes: reviewNotes
    };
    setApplications(updatedApplications);
    setReviewModalOpen(false);
    setCurrentApplication(null);
    // TODO: Make API call to update the review notes/status
  };

  return (
    <div className="space-y-4 inter">
      {/* Toast component for feedback */}
      {toast.message && <Toast message={toast.message} type={toast.type} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Applications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add New Application'}
          </button>
        </div>

        {/* New Application Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 border bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">New Loan Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>
                        {c.first_name} {c.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loan Type Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                  <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Loan Type</option>
                    {loanProducts.map(p => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requested Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    name="requested_amount"
                    value={formData.requested_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter amount"
                    required
                    min={selectedProduct?.min_amount}
                    max={selectedProduct?.max_amount}
                  />
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: ₦{parseFloat(selectedProduct.min_amount).toLocaleString()} | Max: ₦{parseFloat(selectedProduct.max_amount).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Requested Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term (months)</label>
                  <input
                    type="number"
                    name="requested_term"
                    value={formData.requested_term}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter term"
                    required
                    min={selectedProduct?.min_term}
                    max={selectedProduct?.max_term}
                  />
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {selectedProduct.min_term} months | Max: {selectedProduct.max_term} months
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Purpose of loan"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
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
                  Submit Application
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Applications Table */}
        <div className="border bg-white rounded-lg shadow-sm mt-8">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">All Loan Applications</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Application Ref</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Purpose</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={app.id || index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {app.id}
                      </td>
                      <td className="px-6 py-4">{app.customer}</td>
                      <td className="px-6 py-4">₦{parseFloat(app.amount).toLocaleString()}</td>
                      <td className="px-6 py-4">{app.type}</td>
                      <td className="px-6 py-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(statusMapping[app.status] || app.status)}`}>
                          {statusMapping[app.status] || app.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleReview(index)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">Review</button>
                          {(app.status === 'submitted' || app.status === 'under_review') && (
                            <>
                              <button onClick={() => handleApprove(index)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Approve</button>
                              <button onClick={() => handleReject(index)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toast component for notifications */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && currentApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Review Application</h3>
            <div className="mb-4">
              <p><span className="font-medium">Reference:</span> {currentApplication.application_reference}</p>
              <p><span className="font-medium">Customer:</span> {getCustomerName(currentApplication.customer_id)}</p>
              <p><span className="font-medium">Amount:</span> ₦{currentApplication.requested_amount.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
