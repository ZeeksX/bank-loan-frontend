// src/components/admin/Admin.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Toast from "../Toast";
import StatsOverview from './StatsOverview';
import TabNavigation from './TabNavigation';
import ApplicationsTable from './ApplicationsTable';
import UsersTable from './UsersTable';
import { updateApplicationStatus, updateUserStatus, deleteUser } from '../../services/adminService';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState({ message: '', type: '' });
  const {
    allApplications,
    customers,
    loans,
    setAllApplications,
    setCustomers
  } = useOutletContext() ?? {
    allApplications: [],
    customers: [],
    loans: [],
    setAllApplications: () => { },
    setCustomers: () => { }
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleApplicationAction = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      const statusMap = {
        'approved': 'Approved',
        'under_review': 'In Review',
        'rejected': 'Rejected'
      };

      const updatedApplications = allApplications.map(app =>
        app.id === id ? { ...app, status: statusMap[status] } : app
      );

      setAllApplications(updatedApplications);

      const messages = {
        'approved': 'Application approved successfully',
        'under_review': 'Application set to under review',
        'rejected': 'Application rejected'
      };

      showToast(messages[status], 'success');
    } catch (error) {
      console.error(`Error updating application to ${status}:`, error);
      showToast(`Failed to update application status`, 'error');
    }
  };

  const handleUserAction = async (id, action) => {
    try {
      if (action === 'delete') {
        await deleteUser(id);
        const updatedCustomers = customers.filter(customer => customer.id !== id);
        setCustomers(updatedCustomers);
        showToast('User deleted successfully', 'success');
      } else {
        const status = action === 'activate' ? 'approved' : 'suspended';
        await updateUserStatus(id, status);

        const updatedCustomers = customers.map(customer =>
          customer.id === id ? { ...customer, status: action === 'activate' ? 'Active' : 'Suspended' } : customer
        );

        setCustomers(updatedCustomers);
        showToast(`User ${action}d successfully`, 'success');
      }
    } catch (error) {
      console.error(`Error during user ${action}:`, error);
      showToast(`Failed to ${action} user`, 'error');
    }
  };

  const recentApplications = allApplications.slice(0, 5).map((app) => ({
    id: app.id,
    customer: app.customer,
    amount: app.amount,
    type: app.type,
    status: app.status,
    date: app.date
  }));

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <div className="min-h-screen bg-gray-50 inter">
        <div className="flex min-h-screen w-full">
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="w-full">
              <TabNavigation
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                tabs={['overview', 'loans', 'users']}
              />

              {activeTab === 'overview' && (
                <StatsOverview
                  customers={customers}
                  loans={loans}
                  allApplications={allApplications}
                  recentApplications={recentApplications}
                />
              )}

              {activeTab === 'loans' && (
                <ApplicationsTable
                  applications={allApplications}
                  handleReview={(id) => handleApplicationAction(id, 'under_review')}
                  handleApprove={(id) => handleApplicationAction(id, 'approved')}
                  handleReject={(id) => handleApplicationAction(id, 'rejected')}
                />
              )}

              {activeTab === 'users' && (
                <UsersTable
                  customers={customers}
                  handleDelete={(id) => handleUserAction(id, 'delete')}
                  handleActivate={(id) => handleUserAction(id, 'activate')}
                  handleSuspend={(id) => handleUserAction(id, 'suspend')}
                />
              )}
            </div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default Admin;