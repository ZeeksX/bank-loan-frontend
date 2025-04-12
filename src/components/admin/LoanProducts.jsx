import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Toast from '../Toast';

const LoanProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    interest_rate: '',
    min_term: '',
    max_term: '',
    min_amount: '',
    max_amount: '',
    requires_collateral: 0,
    early_payment_fee: '',
    late_payment_fee: '',
    eligibility_criteria: '',
    is_active: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/loans/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setToast({ message: 'Failed to load products', type: 'error' });
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleEditLoanProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/loans/products/${formData.product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();

      // Replace the updated product in the list
      const updatedProducts = products.map(product =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      );

      setProducts(updatedProducts);
      setToast({ message: 'Product updated successfully', type: 'success' });
      setShowForm(false);

      // Reset form
      setFormData({
        product_name: '',
        description: '',
        interest_rate: '',
        min_term: '',
        max_term: '',
        min_amount: '',
        max_amount: '',
        requires_collateral: 0,
        early_payment_fee: '',
        late_payment_fee: '',
        eligibility_criteria: '',
        is_active: 1
      });

    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/loans/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setToast({ message: 'Product created successfully', type: 'success' });
      setShowForm(false);
      setFormData({
        product_name: '',
        description: '',
        interest_rate: '',
        min_term: '',
        max_term: '',
        min_amount: '',
        max_amount: '',
        requires_collateral: 0,
        early_payment_fee: '',
        late_payment_fee: '',
        eligibility_criteria: '',
        is_active: 1
      });

    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleDeactivateLoanProduct = async (productId, isActive) => {
    try {
      const response = await fetch(`http://localhost:8000/api/loans/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ is_active: !isActive })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isActive ? 'deactivate' : 'activate'} product`);
      }

      const updatedProduct = await response.json();
      const updatedProducts = products.map(product =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setToast({ message: `Product ${isActive ? 'deactivated' : 'activated'} successfully`, type: 'success' });

    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteLoanProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/loans/products/${productToDelete.product_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.product_id !== productToDelete.product_id));
      setToast({ message: 'Product deleted successfully', type: 'success' });
      setShowDeleteModal(false);
      setProductToDelete(null);

    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <>
      {toast.message && <Toast message={toast.message} type={toast.type} />}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete product: <strong>{productToDelete?.product_name}</strong>?</p>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                onClick={handleDeleteLoanProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 inter">
        <div className="w-[95%] mx-auto mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Products</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setFormData({
                    product_name: '',
                    description: '',
                    interest_rate: '',
                    min_term: '',
                    max_term: '',
                    min_amount: '',
                    max_amount: '',
                    requires_collateral: 0,
                    early_payment_fee: '',
                    late_payment_fee: '',
                    eligibility_criteria: '',
                    is_active: 1
                  });
                }
              }}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Create New Product'}
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-6 border bg-white rounded-lg shadow-sm "
            >
              <h2 className="text-xl font-semibold mb-4">{formData.product_id ? 'Edit Loan Product' : 'New Loan Product'}</h2>
              <form onSubmit={formData.product_id ? handleEditLoanProduct : handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.product_id && (
                  <input type="hidden" name="id" value={formData.product_id} onChange={handleInputChange} />
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Term (months) *</label>
                  <input
                    type="number"
                    name="min_term"
                    value={formData.min_term}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Term (months) *</label>
                  <input
                    type="number"
                    name="max_term"
                    value={formData.max_term}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="min_amount"
                    value={formData.min_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="max_amount"
                    value={formData.max_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                  <textarea
                    name="eligibility_criteria"
                    value={formData.eligibility_criteria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      name="requires_collateral"
                      checked={formData.requires_collateral}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">Requires Collateral</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Early Payment Fee</label>
                  <input
                    type="text"
                    name="early_payment_fee"
                    value={formData.early_payment_fee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late Payment Fee</label>
                  <input
                    type="text"
                    name="late_payment_fee"
                    value={formData.late_payment_fee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {formData.product_id ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="border bg-white rounded-lg shadow-sm mt-8">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">All Loan Products</h3>
              </div>
              <div className="p-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Product Name</th>
                        <th className="px-6 py-3">Interest Rate</th>
                        <th className="px-6 py-3">Term Range</th>
                        <th className="px-6 py-3">Amount Range</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.product_id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{product.product_name}</td>
                          <td className="px-6 py-4">{product.interest_rate}%</td>
                          <td className="px-6 py-4">{product.min_term}-{product.max_term} months</td>
                          <td className="px-6 py-4">
                            ₦{parseFloat(product.min_amount).toLocaleString()} - ₦{parseFloat(product.max_amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setFormData(product);
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeactivateLoanProduct(product.product_id, product.is_active)}
                                className={`text-${product.is_active ? 'red-600 hover:red-800' : 'green-600 hover:green-800'}`}
                              >
                                {product.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteConfirmation(product)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr className="bg-white border-b">
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No products found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoanProducts;