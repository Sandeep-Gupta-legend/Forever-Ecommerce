import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'

const SearchResults = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { performSearch } = useContext(ShopContext)
    
    const [results, setResults] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const query = searchParams.get('q') || ''
        
        if (query) {
            setSearchQuery(query)
            const foundResults = performSearch(query)
            setResults(foundResults)
        }
    }, [location, performSearch])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Bar */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <button 
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
            
            {/* Results Header */}
            <div className="text-center mb-8">
                <Title text1="SEARCH" text2="RESULTS" />
                {searchQuery && (
                    <p className="text-gray-600 mt-2">
                        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                )}
            </div>
            
            {/* Results Grid */}
            {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
                    {results.map((product) => (
                        <ProductItem
                            key={product._id || product.id}
                            id={product._id || product.id}
                            image={product.image || product.images?.[0]}
                            name={product.name}
                            price={product.price}
                            bestseller={product.bestseller}
                        />
                    ))}
                </div>
            ) : searchQuery ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No products found for "{searchQuery}"</p>
                    <button 
                        onClick={() => navigate('/collection')}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Browse All Products
                    </button>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">Enter a search term to find products</p>
                </div>
            )}
            
            {/* Suggestions */}
            {results.length === 0 && searchQuery && (
                <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-4">Suggestions:</h3>
                    <div className="flex flex-wrap gap-2">
                        {['T-Shirt', 'Jacket', 'Dress', 'Shoes', 'Bestseller'].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => {
                                    setSearchQuery(suggestion)
                                    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchResults