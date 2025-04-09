import React from 'react';
import { motion } from 'framer-motion';
import LoanApplicationForm from "./LoanApplicationForm";

const Apply = () => {
  return (
    <div className="inter flex justify-center w-full p-8 bg-gray-50">
      <div className="flex justify-center items-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold">Apply for a Loan</h1>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                Fill out the application form below. We've made the process simple and straightforward.
              </p>
            </motion.div>
          </div>

          <div className="loan-application-form">
            <LoanApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;