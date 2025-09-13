import React, { useState } from 'react';
import { Check, Loader2, UploadCloud } from 'lucide-react';

const DocumentItem = ({ document, customerId, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size too large (max 5MB)');
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const getButtonClasses = (variant = 'outline', size = 'md', className = '') => {
        let baseClasses = "inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";

        if (variant === 'primary') {
            baseClasses += " border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700";
        } else {
            baseClasses += " border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50";
        }

        if (size === 'sm') {
            baseClasses += " px-3 py-1.5 text-xs";
        } else {
            baseClasses += " px-4 py-2";
        }

        return `${baseClasses} ${className}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('document_type', document.type);
        formData.append('customer_id', customerId);

        try {
            setIsLoading(true);
            const response = await fetch('https://bank-loan-backend-4cyr.onrender.com/api/documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();
            onUploadSuccess(result.document_type);
            setSelectedFile(null);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to upload document');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-between items-center py-4">
            <div>
                <h4 className="font-medium text-gray-900">{document.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex items-center">
                {document.status === 'verified' && (
                    <span className="text-sm text-green-500 font-medium flex items-center">
                        <Check size={16} className="mr-1" /> Verified
                    </span>
                )}
                {document.status === 'pending' && (
                    <span className="text-sm text-amber-500 font-medium">Pending</span>
                )}
                {document.status === 'required' && (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <label className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 hover:text-blue-700">
                            <UploadCloud size={16} className="mr-1" />
                            <span className="text-xs">Select</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </label>
                        {selectedFile && <span className="text-sm text-gray-600">{selectedFile.name}</span>}
                        <button
                            type="submit"
                            className={getButtonClasses('primary', 'sm')}
                            disabled={isLoading || !selectedFile}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Upload'}
                        </button>
                    </form>
                )}
                {document.file_name && document.status !== 'required' && (
                    <span className="text-sm text-gray-600 ml-2">Uploaded: {document.file_name}</span>
                )}
            </div>
        </div>
    );
};

export default DocumentItem;