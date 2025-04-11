import React from 'react';
import { motion } from 'framer-motion';

const ProgressStepper = ({ stepsArray, currentStepIndex }) => {

    // --- Stepper Styling Helper Functions --- (Moved inside or passed as props if needed elsewhere)
    const getStepClass = (index) => { // Determines class for the step circle
        if (index === currentStepIndex) return 'bg-blue-600 scale-110 shadow-md'; // Active step style
        if (index < currentStepIndex) return 'bg-green-500'; // Completed step style
        return 'bg-gray-300'; // Future step style
    };

    const getConnectorClass = (index) => { // Determines class for the connector line
        if (index < currentStepIndex) return 'bg-green-500'; // Connector after completed step
        return 'bg-gray-300'; // Connector for future steps
    };

    return (
        <div className="">
            <div className="flex items-center mb-4 sm:mb-8"> 
                {stepsArray.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center flex-shrink-0 mx-1 sm:mx-2">
                            <motion.div
                                initial={false}
                                animate={{ scale: index === currentStepIndex ? 1.15 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm ${getStepClass(index)} transition-colors duration-300 shadow-sm`}
                            >
                                {index + 1}
                            </motion.div>
                            <div className="text-xs mt-1.5 hidden sm:block capitalize text-gray-600 font-medium">
                                {step.replace('-', ' ')} 
                            </div>
                        </div>
                        {index < stepsArray.length - 1 && (
                            <div className={`flex-1 h-0.5 ${getConnectorClass(index)} transition-colors duration-300 mt-[-16px] sm:mt-[-20px]`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <hr className="border-gray-200" />
        </div>
    );
};

export default ProgressStepper;