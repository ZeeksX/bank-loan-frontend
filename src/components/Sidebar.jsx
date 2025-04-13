import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Settings,
  CreditCard,
  LogOut
} from 'lucide-react';
import { motion } from "framer-motion";
import { useAuth } from "./Auth";
import Loader from "./ui/Loader";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [loading, setLoading] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Loan Applications',
      icon: FileText,
      path: '/admin/loans',
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users',
    },
    {
      title: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
    },
  ];

  const settingsMenuItems = [
    {
      title: 'Profile',
      icon: Settings,
      path: '/admin/profile',
    },
    {
      title: 'Loan Products',
      icon: DollarSign,
      path: '/admin/products',
    },
  ];

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      logout();
      navigate("/login");
    }, 2000);
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    handleCloseLogoutDialog();
    handleLogout();
  };

  // Helper function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to get the appropriate class based on active state
  const getItemClass = (path) => {
    if (isActive(path)) {
      return "flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white transition-colors";
    } else {
      return "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700";
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="inter w-64 fixed min-h-screen bg-white shadow-md flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center p-6">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">B</span>
            </motion.div>
            <span className="font-semibold text-xl text-zinc-900">BankLoan</span>
          </div>
        </div>

        {/* Sidebar Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Section */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Main</p>
            <ul className="space-y-1">
              {adminMenuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={getItemClass(item.path)}
                    title={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Configuration Section */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</p>
            <ul className="space-y-1">
              {settingsMenuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={getItemClass(item.path)}
                    title={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4">
          <button
            onClick={handleOpenLogoutDialog}
            className="flex cursor-pointer items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        sx={{ fontFamily: "inter" }}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Exit"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button onClick={handleConfirmLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;