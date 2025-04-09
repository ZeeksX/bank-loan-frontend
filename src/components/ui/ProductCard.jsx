import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
    return (
        <>
            <h3 className="text-lg font-medium mb-2 text-gray-900">{product.product_name}</h3>
            <div className="flex justify-between mb-4">
                <div>
                    <div className="text-gray-500 text-xs">Interest Rate</div>
                    <div className="font-medium text-gray-900">{product.interest_rate}</div>
                </div>
                <div>
                    <div className="text-gray-500 text-xs">Term</div>
                    <div className="text-gray-900">{product.min_term} - {product.max_term} months</div>
                </div>
            </div>
            <div className="mb-4">
                <div className="text-gray-500 text-xs">Amount</div>
                <div className="font-medium text-gray-900">₦{product.min_amount} - ₦{product.max_amount}</div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            <Link to={`/apply/${product.id}`}>
                <button className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
                    Apply Now
                </button>
            </Link>
        </>
    )
}

export default ProductCard