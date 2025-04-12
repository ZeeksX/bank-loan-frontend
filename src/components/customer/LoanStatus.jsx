import React from 'react';

const LoanStatus = ({ loan }) => {
    // Return a default message if no loan is passed
    if (!loan) {
        return <p>No current loan application.</p>;
    }

    // A helper to generate status steps based on the loan status.
    const getSteps = (loanStatus, startDate) => {
        // Initialize the steps with default values.
        let steps = [
            { id: 1, title: 'Application Submitted', description: 'Your loan application has been received.', date: startDate || 'N/A', completed: false, isActive: false },
            { id: 2, title: 'Under Review', description: 'Your loan application is under review.', date: startDate || 'N/A', completed: false, isActive: false },
            { id: 3, title: 'Loan Approval', description: 'Your loan is being reviewed for approval.', date: 'Pending', completed: false, isActive: false },
            { id: 4, title: 'Disbursement', description: 'The approved loan amount will be disbursed to your account.', date: 'Pending', completed: false, isActive: false },
        ];

        // Update the steps based on the current loan status.
        switch (loanStatus) {
            case 'submitted':
                steps[0].completed = true;
                steps[1].isActive = true;
                break;
            case 'under_review':
                steps[0].completed = true;
                steps[1].completed = true;
                steps[1].isActive = true;
                break;
            case 'approved':
                steps[0].completed = true;
                steps[1].completed = true;
                steps[2].completed = true;
                steps[2].isActive = true;
                break;
            case 'active':
                // All steps are considered complete if the loan is active.
                steps = steps.map(step => ({ ...step, completed: true }));
                break;
            default:
                // Unknown status; fallback to activating step 2
                steps[0].completed = true;
                steps[1].isActive = true;
                break;
        }

        return steps;
    };

    // Generate the steps using the loan status and start date.
    const steps = getSteps(loan.status, loan.start_date);

    return (
        <div className="space-y-8">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : step.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            {step.completed ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className={`text-sm font-medium ${step.isActive ? 'text-white' : 'text-gray-500'}`}>
                                    {step.id}
                                </span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                    </div>
                    <div>
                        <h3 className={`font-medium ${step.isActive ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                        <p className="text-gray-400 text-xs mt-2">{step.date}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoanStatus;
