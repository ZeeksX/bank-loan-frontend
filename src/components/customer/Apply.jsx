import React, { useState, useEffect } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import LoanApplicationForm from "./LoanApplicationForm";
import Loader from '../ui/Loader';

const Apply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  // State to manage loading/redirecting status
  // Initialize based on whether product exists initially
  const [isRedirecting, setIsRedirecting] = useState(!product);

  // Effect to handle redirection if no product is provided
  useEffect(() => {
    let redirectTimer = null; // To store the timeout ID

    if (!product) {
      setIsRedirecting(true); // Make sure redirect state is true
      // Set a timer to navigate back to products page
      redirectTimer = setTimeout(() => {
        navigate("/products", { replace: true }); // Use replace to avoid adding to history
      }, 1000); // 1-second delay
    } else {
      // If product somehow becomes available later (unlikely with route state, but good practice)
      setIsRedirecting(false);
    }

    // Cleanup function: This runs when the component unmounts
    // or if the dependencies (product, navigate) change.
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer); // Clear the timeout if component unmounts
      }
    };
  }, [product, navigate]); // Dependencies for the effect

  // Conditional Rendering Logic:

  // 1. If redirecting (because no product was found)
  if (isRedirecting) {
    return (
      <div className="inter flex flex-col justify-center items-center w-full p-8 bg-gray-50 min-h-screen">
        {/* Center content */}
        <Loader />
        <p className="text-gray-600 mt-4 text-center">
          No loan product selected. Redirecting you to the products page...
        </p>
      </div>
    );
  }

  // 2. If product exists and we are not redirecting
  return (
    <div className="inter flex justify-center w-full p-4 md:p-8 bg-gray-50 min-h-screen"> {/* Adjust padding */}
      <div className="w-full max-w-6xl mx-auto"> {/* Ensure content stretches but has max width */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dynamic Title */}
            <h1 className="text-3xl md:text-4xl font-bold">
              Apply for {product.product_name} {/* Product is guaranteed here */}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Fill out the application form below. We've made the process simple and straightforward.
            </p>
          </motion.div>
        </div>
        <div className="loan-application-form">
          {/* Product exists, so pass it to the form */}
          <LoanApplicationForm product={product} />
        </div>
      </div>
    </div>
  );
};

export default Apply;