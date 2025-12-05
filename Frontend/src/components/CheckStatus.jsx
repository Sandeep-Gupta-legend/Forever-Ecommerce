import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'

const CheckStatus = () => {
    const { products, loading, error } = useContext(ShopContext)

    useEffect(() => {
        console.log('=== APP STATUS ===')
        console.log('Products:', products.length)
        console.log('Loading:', loading)
        console.log('Error:', error)
        
        // Check if API is accessible
        fetch('http://localhost:3000/api/product')
            .then(res => {
                console.log('API Status:', res.status)
                return res.json()
            })
            .then(data => {
                console.log('API Data:', data)
                console.log('Products count:', data.data?.length || data.products?.length || 0)
            })
            .catch(err => console.log('API Error:', err))
    }, [products, loading, error])

    if (loading) {
        return (
            <div className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-50 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading products...
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded z-50">
                Error: {error}
            </div>
        )
    }

    return (
        <div className="fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded z-50 text-sm">
            ✅ {products.length} products loaded
        </div>
    )
}

export default CheckStatus