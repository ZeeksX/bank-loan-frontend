import React, { useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

const DocumentUploadForm = ({ documentType, customerId, onUploadSuccess, onCancel }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('document_type', documentType);
        formData.append('customer_id', customerId);

        try {
            setIsLoading(true);
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            onUploadSuccess(result);
            setSelectedFile(null);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to upload document');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 hover:text-blue-700">
                        <UploadCloud size={20} />
                        <span className="mt-1 text-xs">Select File</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                    </label>

                    <div className="flex-1">
                        {selectedFile ? (
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No file selected</p>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isLoading || !selectedFile}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Uploading...' : 'Upload Document'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
export default DocumentUploadForm;