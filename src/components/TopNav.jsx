import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from "./Auth";
import Loader from "./ui/Loader";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 2000);

    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
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

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Apply', path: '/apply' },
    { name: 'My Loans', path: '/my-loans' },
    { name: 'Profile', path: '/profile' },
  ];

  // Common function for NavLink classnames
  const getDesktopLinkClasses = ({ isActive }) =>
    `text-sm font-medium rounded-md ${isActive ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`;

  const getMobileLinkClasses = ({ isActive }) =>
    `w-full justify-start py-3 text-base ${isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-zinc-700 hover:text-zinc-900'}`;

  return (
    <>
      {loading && <Loader />}
      <header
        className={`${loading ? 'hidden' : ''} fixed inter top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-100'
            : 'py-5 bg-transparent'
          }`}
      >
        <div className="container mx-auto w-[95vw] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex justify-center items-center gap-2">
            <motion.div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </motion.div>
            <span className="font-semibold text-xl text-zinc-900">BankLoan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getDesktopLinkClasses}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions (Desktop) */}
          <div className="hidden md:flex items-center gap-6 space-x-2">
            <button className="rounded-full text-zinc-500 hover:text-zinc-700">
              <Bell className="h-5 w-5 cursor-pointer hover:rounded-full" />
              <span className="sr-only">Notifications</span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="profile-dropdown-container relative">
              <button
                className="rounded-full text-zinc-500 hover:text-zinc-700"
                onClick={toggleProfileDropdown}
              >
                <User className="h-5 w-5 cursor-pointer hover:rounded-full" />
                <span className="sr-only">Profile</span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Your Profile
                  </NavLink>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    onClick={handleOpenLogoutDialog}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu Panel */}
      <motion.div
        className={`fixed inset-0 z-40 bg-white md:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 h-full flex flex-col">
          <nav className="flex flex-col space-y-4 text-lg flex-grow">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getMobileLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile logout button */}
            <button
              className="w-full justify-start py-3 text-base text-red-600 hover:bg-red-50 flex items-center"
              onClick={handleOpenLogoutDialog}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        className='inter'
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
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

export default TopNav;
