import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Toast from '../Toast';
import LoanProductForm from './LoanProductForm';
import LoanProductTable from './LoanProductTable';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

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

      const updatedProducts = products.map(product =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      );

      setProducts(updatedProducts);
      setToast({ message: 'Product updated successfully', type: 'success' });
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

      <DeleteConfirmationModal
        show={showDeleteModal}
        onCancel={handleCancelDelete}
        onDelete={handleDeleteLoanProduct}
        productName={productToDelete?.product_name}
      />

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
            <LoanProductForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={formData.product_id ? handleEditLoanProduct : handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          <LoanProductTable
            products={products}
            onEdit={(product) => {
              setFormData(product);
              setShowForm(true);
            }}
            onDeactivate={handleDeactivateLoanProduct}
            onDelete={handleDeleteConfirmation}
          />

        </div>
      </div>
    </>
  );
};

export default LoanProducts;