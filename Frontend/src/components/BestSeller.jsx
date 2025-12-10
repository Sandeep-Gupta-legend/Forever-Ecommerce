
import React, { useContext } from 'react'
import ProductItem from './ProductItem'
import { ShopContext } from '../context/ShopContext'

const BestSeller = () => {
    const { products, loading } = useContext(ShopContext)
    
    // Filter bestseller products
    const bestsellerProducts = products.filter(product => product.bestseller === true)
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        )
    }
    
    if (bestsellerProducts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No bestseller products found</p>
            </div>
        )
    }
    
    return (
        <div className="px-4 md:px-8 lg:px-16 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Bestseller Products</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {bestsellerProducts.map((product) => {
                    // Debug log for each product
                    console.log('Bestseller product:', {
                        id: product._id,
                        name: product.name,
                        images: product.images,
                        imagesType: typeof product.images,
                        isArray: Array.isArray(product.images)
                    })
                    
                    // Get first image from images array
                    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23e5e7eb' width='300' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                    const productImage = Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                        ? product.images[0] 
                        : (product.image || placeholderImage)
                    
                    return (
                        <ProductItem
                            key={product._id || product.id}
                            id={product._id || product.id}
                            name={product.name}
                            price={product.price}
                            description={product.description}
                            image={productImage}
                            bestseller={product.bestseller}
                        />
                    )
                })}
            </div>
            
            {/* Debug info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <p>Total products: {products.length}</p>
                <p>Bestseller products: {bestsellerProducts.length}</p>
                <p className="text-xs text-gray-500">Check console for detailed product info</p>
            </div>
        </div>
    )
}

export default BestSeller