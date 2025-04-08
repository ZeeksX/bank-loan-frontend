import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Bell, User } from 'lucide-react';

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Apply', path: '/apply' },
    { name: 'My Loans', path: '/my-loans' },
    { name: 'Profile', path: '/profile' },
  ];

  // Function to determine if a link is active - handles base path '/' specifically
  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path); // More robust for nested routes if needed
  };


  return (
    <>
      <header
        // Using data attributes for cleaner state management in CSS/Tailwind if preferred
        // data-scrolled={isScrolled}
        className={`fixed inter top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 bg-white/90  backdrop-blur-md shadow-sm border-b border-zinc-100' // Added subtle border
          : 'py-5 bg-transparent'
          }`}
      >
        <div className="container mx-auto w-[95vw] px-4 sm:px-6 lg:px-8 flex items-center justify-between"> {/* Use standard container padding */}
          {/* Logo */}
          <Link to="/" className="flex  justify-center items-center gap-2">
            <motion.div
              //   initial={{ rotate: 0 }} // Keep or remove animation as preferred
              //   animate={{ rotate: 360 }}
              //   transition={{ duration: 1, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">B</span>
            </motion.div>
            <span className="font-semibold text-xl text-zinc-900">BankLoan</span> {/* Adjusted font-weight and color */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                className={`
                   text-sm font-medium rounded-md
                  ${isLinkActive(link.path)
                    ? 'text-blue-600' // Active style
                    : 'text-zinc-600  hover:text-zinc-900' // Inactive style
                  }
                `}
              >
                <Link to={link.path}>
                  {link.name}
                </Link>
              </button>
            ))}
          </nav>

          {/* Right side actions (Desktop) */}
          <div className="hidden md:flex items-center gap-6 space-x-2"> {/* Reduced spacing */}
            <button className="rounded-full text-zinc-500  hover:text-zinc-700 ">
              <Bell className="h-5 w-5 cursor-pointer hover:rounded-full" />
              <span className="sr-only">Notifications</span>
            </button>
            <button className="rounded-full text-zinc-500 hover:text-zinc-700 ">
              <User className="h-5 w-5 cursor-pointer hover:rounded-full" />
              <span className="sr-only">Profile</span>
            </button>
            {/* <button className="rounded-full text-white px-4 py-3 text-sm bg-[#0070f0]">Get Started</button>  */}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-600  hover:text-zinc-900"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen} // Accessibility
          >
            {/* Conditionally render Menu or X icon */}
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu Panel */}
      <motion.div
        className={`fixed inset-0 z-40 bg-white  md:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full' // Use transform for smoother animation
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 h-full flex flex-col">
          <nav className="flex flex-col space-y-4 text-lg flex-grow"> {/* Use flex-grow */}
            {navLinks.map((link) => (
              <button
                key={link.path}
                className={`
                  w-full justify-start py-3 text-base
                  ${isLinkActive(link.path)
                    ? 'text-blue-600  bg-blue-50  font-medium' // Active style
                    : 'text-zinc-700 hover:text-zinc-900' // Inactive style
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                <Link to={link.path}>
                  {link.name}
                </Link>
              </button>
            ))}
          </nav>

          {/* Actions at the bottom of mobile menu */}
          <div className="pt-6 flex gap-6 border-t border-zinc-100 space-y-4">
            <div className="flex items-center gap-6 justify-around">
              <button className="rounded-full text-zinc-500 ">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </button>
              <button className="rounded-full text-zinc-500 ">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </button>
            </div>
            <button className="w-full rounded-md text-sm bg-[#0070f0]">Get Started</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TopNav;