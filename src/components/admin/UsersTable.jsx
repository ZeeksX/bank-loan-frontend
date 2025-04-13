import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UsersTable = ({ customers, handleDelete, handleActivate, handleSuspend }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentCustomer, setCurrentCustomer] = useState(null);
     console.log("Customers", customers)

    const handleActionClick = (action, customer) => {
        setCurrentAction(action);
        setCurrentCustomer(customer);
        setOpenDialog(true);
    };

    const handleConfirmAction = () => {
        if (currentAction === 'delete') {
            handleDelete(currentCustomer.customer_id);
        } else if (currentAction === 'suspend') {
            handleSuspend(currentCustomer.customer_id);
        } else if (currentAction === 'activate') {
            handleActivate(currentCustomer.customer_id);
        }
        setOpenDialog(false);
    };

    const getDialogContent = () => {
        if (!currentCustomer) return null;

        switch (currentAction) {
            case 'delete':
                return `Are you sure you want to delete ${currentCustomer.first_name} ${currentCustomer.last_name}? This action cannot be undone.`;
            case 'suspend':
                return `Are you sure you want to suspend ${currentCustomer.first_name} ${currentCustomer.last_name}?`;
            case 'activate':
                return `Are you sure you want to activate ${currentCustomer.first_name} ${currentCustomer.last_name}?`;
            default:
                return null;
        }
    };

    const getDialogTitle = () => {
        if (!currentAction) return 'Confirm Action';

        switch (currentAction) {
            case 'delete':
                return 'Confirm Deletion';
            case 'suspend':
                return 'Confirm Suspension';
            case 'activate':
                return 'Confirm Activation';
            default:
                return 'Confirm Action';
        }
    };

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
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
                                        <th scope="col" className="px-6 py-3">Loans</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr key={customer.customer_id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{customer.customer_id}</td>
                                                <td className="px-6 py-4">{customer.first_name} {customer.last_name}</td>
                                                <td className="px-6 py-4">{customer.email}</td>
                                                <td className="px-6 py-4">{customer.created_at}</td>
                                                <td className="px-6 py-4">{customer.total}</td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={customer.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleActionClick('delete', customer)}
                                                            className="text-red-600 cursor-pointer hover:text-red-800 text-xs p-1 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                        {customer.status === 'Active' ? (
                                                            <button
                                                                onClick={() => handleActionClick('suspend', customer)}
                                                                className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs p-1 font-medium"
                                                            >
                                                                Suspend
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActionClick('activate', customer)}
                                                                className="text-green-600 cursor-pointer hover:text-green-800 text-xs p-1 font-medium"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='bg-white border-b hover:bg-gray-50'>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {getDialogTitle()}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {getDialogContent()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmAction} autoFocus color={currentAction === 'delete' ? 'error' : 'primary'}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsersTable;