import React from 'react'

const LoanStatus = () => {
    const loanStatusSteps = [
        {
            id: 1,
            title: 'Application Submitted',
            description: 'Your loan application has been received.',
            completed: true,
            date: '12/05/2023',
        },
        {
            id: 2,
            title: 'Verification Process',
            description: 'We are verifying your personal and financial information.',
            completed: true,
            date: '12/06/2023',
        },
        {
            id: 3,
            title: 'Loan Approval',
            description: 'Your loan is being reviewed for approval.',
            completed: true,
            date: '09/04/2025',
        },
        {
            id: 4,
            title: 'Disbursement',
            description: 'The approved loan amount will be disbursed to your account.',
            completed: false,
            isActive: true,
            date: 'Pending',
        },
    ];

    return (
        <>
            <div className="space-y-8">
                {loanStatusSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : step.isActive ? 'bg-blue-600' : 'bg-gray-200'
                                }`}>
                                {step.completed ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className={`text-sm font-medium ${step.isActive ? 'text-white' : 'text-gray-500'
                                        }`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            {index < loanStatusSteps.length - 1 && (
                                <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-medium ${step.isActive ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                {step.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                            <p className="text-gray-400 text-xs mt-2">{step.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default LoanStatus