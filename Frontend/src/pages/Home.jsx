
import React, { useContext } from 'react'
import BestSeller from '../components/BestSeller'
import { ShopContext } from '../context/ShopContext'

const Home = () => {
    const { products, loading } = useContext(ShopContext)
    
    console.log('Home component - Products:', products.length)
    console.log('Home component - Loading:', loading)
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600">Loading store...</p>
                </div>
            </div>
        )
    }
    
    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-4">No Products Available</h1>
                    <p className="text-gray-500">Check back soon for new products!</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-50 to-pink-50 py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Welcome to Our Store
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover amazing products at great prices. Shop now for the best deals!
                </p>
            </div>
            
            {/* Bestseller Section */}
            <div className="py-12">
                <BestSeller />
            </div>
            
            {/* Debug Info */}
            <div className="p-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h3 className="font-semibold mb-2">Store Status:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">Products</p>
                            <p className="text-2xl font-bold">{products.length}</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">Bestsellers</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {products.filter(p => p.bestseller).length}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">Men's</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {products.filter(p => p.category === 'Men').length}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">Women's</p>
                            <p className="text-2xl font-bold text-pink-600">
                                {products.filter(p => p.category === 'Women').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
