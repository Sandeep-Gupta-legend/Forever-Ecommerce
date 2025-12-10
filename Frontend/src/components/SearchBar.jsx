import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const SearchBar = () => {
    const navigate = useNavigate()
    const { 
        showSearch, 
        setShowSearch, 
        performSearch,
        setSearchTerm,
        clearSearch
    } = useContext(ShopContext)
    
    const [localSearchTerm, setLocalSearchTerm] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (localSearchTerm.trim()) {
            // Update the context search term
            setSearchTerm(localSearchTerm)
            
            // Perform search and get results
            const results = performSearch(localSearchTerm)
            
            // Close search modal
            setShowSearch(false)
            
            // Navigate to search results page with the search term
            navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`)
            
            // Clear local state
            setLocalSearchTerm('')
        }
    }
    
    const handleClose = () => {
        clearSearch()
        setLocalSearchTerm('')
        setShowSearch(false)
    }

    if (!showSearch) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Search Products</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl p-1"
                    >
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        placeholder="Search for products, categories..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <button 
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </form>
                
                <div className="mt-4 text-sm text-gray-500">
                    <p>Try searching for: "t-shirt", "jacket", "bestseller"</p>
                </div>
            </div>
        </div>
    )
}

export default SearchBar